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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "未設定 GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body: OutfitImageRequest = await request.json();
    const prompt = buildPrompt(body);

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);

      // Parse error for user-friendly message
      let userMessage = "圖片生成失敗";
      try {
        const errData = JSON.parse(errText);
        const status = errData?.error?.status;
        if (status === "RESOURCE_EXHAUSTED") {
          userMessage = "API 額度已用完，請稍後再試";
        } else if (status === "INVALID_ARGUMENT") {
          userMessage = "請求參數錯誤";
        } else if (status === "PERMISSION_DENIED") {
          userMessage = "API Key 權限不足";
        }
      } catch {
        // keep default message
      }

      return NextResponse.json(
        { error: userMessage },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const parts = data?.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 502 }
      );
    }

    // Find the image part
    const imagePart = parts.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
    );

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        { error: "No image in response" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (error) {
    console.error("Outfit image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
