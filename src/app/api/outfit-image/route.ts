import { NextRequest, NextResponse } from "next/server";

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
  cool: "涼爽",
  chilly: "偏冷",
  cold: "寒冷",
  freezing: "嚴寒",
};

function buildPrompt(req: OutfitImageRequest): string {
  const { weather, outfit } = req;
  const levelLabel = TEMPERATURE_LABEL[outfit.temperatureLevel] ?? outfit.temperatureLevel;

  let clothingDesc = `上衣：${outfit.topName}、下著：${outfit.bottomName}`;
  if (outfit.outerwearName) {
    clothingDesc += `、外套：${outfit.outerwearName}`;
  }
  if (outfit.accessories.length > 0) {
    clothingDesc += `、配件：${outfit.accessories.join("、")}`;
  }
  if (outfit.rainGearName) {
    clothingDesc += `、${outfit.rainGearName}`;
  }

  return `Generate a fashion illustration of a single person wearing the following outfit for ${levelLabel} (${weather.weatherDesc}) weather at ${weather.temperature}°C in ${weather.location}, Taiwan:

Clothing: ${clothingDesc}

Style requirements:
- Clean, modern fashion illustration style
- Full body view, single person standing
- Simple solid color background matching the weather mood
- The clothing should be clearly visible and recognizable
- Stylish and appealing illustration
- No text or labels in the image`;
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

      return NextResponse.json(
        { error: userMessage },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "未收到生成圖片" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: imageBase64,
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("Outfit image generation error:", error);
    return NextResponse.json(
      { error: "伺服器內部錯誤" },
      { status: 500 }
    );
  }
}
