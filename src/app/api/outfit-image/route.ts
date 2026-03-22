import { NextRequest, NextResponse } from "next/server";

// --- Server-side image cache (shared across all users within the same process) ---
interface CacheEntry {
  image: string;
  mimeType: string;
  createdAt: number;
}

const imageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // prevent unbounded memory growth

function buildCacheKey(body: OutfitImageRequest): string {
  const date = new Date().toISOString().slice(0, 10);
  const { weather, outfit } = body;
  return `${date}-${weather.location}-${weather.temperature}-${weather.weatherDesc}-${outfit.temperatureLevel}`;
}

/** Evict expired entries; if still over limit, remove oldest */
function evictCache() {
  const now = Date.now();
  for (const [key, entry] of imageCache) {
    if (now - entry.createdAt > CACHE_TTL) {
      imageCache.delete(key);
    }
  }
  if (imageCache.size > MAX_CACHE_SIZE) {
    // delete oldest entry
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey) imageCache.delete(oldestKey);
  }
}

// In-flight request dedup: prevents cache stampede when multiple users
// request the same key simultaneously
const inFlightRequests = new Map<string, Promise<{ image: string; mimeType: string }>>();

interface OutfitImageRequest {
  weather: {
    location: string;
    temperature: number;
    feelsLike: number;
    minTemp: number;
    maxTemp: number;
    rainProbability: number;
    weatherDesc: string;
  };
  outfit: {
    topName: string;
    bottomName: string;
    outerwearName?: string;
    accessories: string[];
    rainGearName?: string;
    temperatureLevel: string;
    summary: string;
  };
}

const TEMPERATURE_LABEL: Record<string, string> = {
  scorching: "酷熱",
  hot: "炎熱",
  warm: "溫暖",
  mild: "舒適",
  cool: "涼爽",
  chilly: "偏冷",
  cold: "寒冷",
  freezing: "嚴寒",
};

function buildPrompt(req: OutfitImageRequest): string {
  const { weather, outfit } = req;
  const levelLabel = TEMPERATURE_LABEL[outfit.temperatureLevel] ?? outfit.temperatureLevel;

  let clothingDesc = `上衣：${outfit.topName}、下著：${outfit.bottomName}`;

  // 涼爽等級：外套拿在手上而非穿著
  const isCool = outfit.temperatureLevel === "cool";

  if (outfit.outerwearName) {
    if (isCool) {
      clothingDesc += `、外套：${outfit.outerwearName}（拿在手上）`;
    } else {
      clothingDesc += `、外套：${outfit.outerwearName}`;
    }
  }
  if (outfit.accessories.length > 0) {
    clothingDesc += `、配件：${outfit.accessories.join("、")}`;
  }
  if (outfit.rainGearName) {
    clothingDesc += `、${outfit.rainGearName}`;
  }

  let outerwearInstruction = "";
  if (isCool && outfit.outerwearName) {
    outerwearInstruction = "\n- The jacket/outerwear should be carried in hand or draped over the arm, NOT worn on the body";
  }

  return `Generate a fashion illustration of a single person wearing the following outfit for ${levelLabel} (${weather.weatherDesc}) weather at ${weather.temperature}°C in ${weather.location}, Taiwan:

Clothing: ${clothingDesc}

Style requirements:
- Clean, modern fashion illustration style
- Full body view, single person standing
- Simple solid color background matching the weather mood
- The clothing should be clearly visible and recognizable
- Stylish and appealing illustration
- No text or labels in the image${outerwearInstruction}`;
}

async function callOpenAI(apiKey: string, body: OutfitImageRequest): Promise<{ image: string; mimeType: string }> {
  const prompt = buildPrompt(body);

  const openaiRes = await fetch(
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1536",
        quality: "low",
      }),
    }
  );

  if (!openaiRes.ok) {
    const errData = await openaiRes.json().catch(() => null);
    const errMessage = errData?.error?.message || "";
    console.error("OpenAI API error:", openaiRes.status, errMessage);

    let userMessage = "圖片生成失敗";
    if (openaiRes.status === 429) {
      userMessage = "API 額度已用完，請稍後再試";
    } else if (openaiRes.status === 401) {
      userMessage = "API Key 無效或權限不足";
    } else if (openaiRes.status === 400) {
      userMessage = "請求參數錯誤";
    }

    throw new Error(userMessage);
  }

  const data = await openaiRes.json();
  const imageBase64 = data?.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("未收到生成圖片");
  }

  return { image: imageBase64, mimeType: "image/png" };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "未設定 OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body: OutfitImageRequest = await request.json();
    const skipCache = new URL(request.url).searchParams.get("skipCache") === "1";
    const cacheKey = buildCacheKey(body);

    // 1. Check cache (unless skipCache)
    if (!skipCache) {
      const cached = imageCache.get(cacheKey);
      if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
        return NextResponse.json({ image: cached.image, mimeType: cached.mimeType });
      }
    }

    // 2. Dedup: if another request for the same key is already in-flight, wait for it
    let resultPromise = !skipCache ? inFlightRequests.get(cacheKey) : undefined;

    if (!resultPromise) {
      resultPromise = callOpenAI(apiKey, body);
      if (!skipCache) {
        inFlightRequests.set(cacheKey, resultPromise);
      }
    }

    let result: { image: string; mimeType: string };
    try {
      result = await resultPromise;
    } finally {
      inFlightRequests.delete(cacheKey);
    }

    // 3. Store in cache
    evictCache();
    imageCache.set(cacheKey, { ...result, createdAt: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    const message = (error as Error).message || "伺服器內部錯誤";
    console.error("Outfit image generation error:", message);
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
