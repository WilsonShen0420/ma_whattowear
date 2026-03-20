import { ClothingItem, OutfitRecommendation, TemperatureLevel } from "./types";
import { WeatherData } from "../weather/types";

/** 根據體感溫度判斷溫度等級 */
function getTemperatureLevel(feelsLike: number): TemperatureLevel {
  if (feelsLike >= 33) return "scorching";
  if (feelsLike >= 28) return "hot";
  if (feelsLike >= 23) return "warm";
  if (feelsLike >= 18) return "cool";
  if (feelsLike >= 13) return "chilly";
  if (feelsLike >= 8) return "cold";
  return "freezing";
}

const TEMPERATURE_LABEL: Record<TemperatureLevel, string> = {
  scorching: "酷熱",
  hot: "炎熱",
  warm: "溫暖",
  cool: "涼爽",
  chilly: "偏冷",
  cold: "寒冷",
  freezing: "嚴寒",
};

/** 上衣對照表 */
function getTop(level: TemperatureLevel): ClothingItem {
  switch (level) {
    case "scorching":
      return { id: "tank-top", name: "背心", category: "top", color: "#ffffff" };
    case "hot":
      return { id: "t-shirt", name: "短袖T恤", category: "top", color: "#87CEEB" };
    case "warm":
      return { id: "t-shirt", name: "短袖T恤", category: "top", color: "#98D8C8" };
    case "cool":
      return { id: "long-sleeve", name: "長袖上衣", category: "top", color: "#B8C9E1" };
    case "chilly":
      return { id: "long-sleeve", name: "長袖上衣", category: "top", color: "#7B9EC4" };
    case "cold":
      return { id: "sweater", name: "毛衣", category: "top", color: "#8B7355" };
    case "freezing":
      return { id: "sweater", name: "厚毛衣", category: "top", color: "#6B4226" };
  }
}

/** 下身對照表 */
function getBottom(level: TemperatureLevel): ClothingItem {
  switch (level) {
    case "scorching":
    case "hot":
      return { id: "shorts", name: "短褲", category: "bottom", color: "#D4C5A9" };
    case "warm":
      return { id: "light-pants", name: "薄長褲", category: "bottom", color: "#A0B4C8" };
    case "cool":
    case "chilly":
      return { id: "thick-pants", name: "長褲", category: "bottom", color: "#4A5568" };
    case "cold":
    case "freezing":
      return { id: "thick-pants", name: "厚長褲", category: "bottom", color: "#2D3748" };
  }
}

/** 外套對照表 */
function getOuterwear(level: TemperatureLevel): ClothingItem | undefined {
  switch (level) {
    case "scorching":
    case "hot":
      return undefined;
    case "warm":
      return { id: "light-jacket", name: "薄外套（備用）", category: "outerwear", color: "#D1D5DB" };
    case "cool":
      return { id: "cardigan", name: "針織外套", category: "outerwear", color: "#9CA3AF" };
    case "chilly":
      return { id: "jacket", name: "夾克", category: "outerwear", color: "#6B7280" };
    case "cold":
      return { id: "coat", name: "大衣", category: "outerwear", color: "#4B5563" };
    case "freezing":
      return { id: "down-jacket", name: "羽絨外套", category: "outerwear", color: "#1F2937" };
  }
}

/** 配件對照表 */
function getAccessories(
  level: TemperatureLevel,
  rainProb: number
): ClothingItem[] {
  const items: ClothingItem[] = [];

  // 酷熱/炎熱 -> 帽子、太陽眼鏡
  if (level === "scorching" || level === "hot") {
    items.push({ id: "hat", name: "遮陽帽", category: "accessory", color: "#F5DEB3" });
    items.push({ id: "sunglasses", name: "太陽眼鏡", category: "accessory", color: "#1a1a1a" });
  }

  // 偏冷以下 -> 圍巾
  if (level === "chilly" || level === "cold" || level === "freezing") {
    items.push({ id: "scarf", name: "圍巾", category: "accessory", color: "#C53030" });
  }

  // 嚴寒 -> 手套、毛帽
  if (level === "freezing") {
    items.push({ id: "gloves", name: "手套", category: "accessory", color: "#2D3748" });
    items.push({ id: "beanie", name: "毛帽", category: "accessory", color: "#4A5568" });
  }

  return items;
}

/** 雨具建議 */
function getRainGear(rainProb: number): ClothingItem | undefined {
  if (rainProb >= 70) {
    return { id: "umbrella", name: "雨傘（必備）", category: "rainGear", color: "#3B82F6" };
  }
  if (rainProb >= 40) {
    return { id: "umbrella", name: "折疊傘（建議攜帶）", category: "rainGear", color: "#60A5FA" };
  }
  return undefined;
}

/** 產生穿搭摘要文字 */
function generateSummary(
  level: TemperatureLevel,
  weather: WeatherData,
  outerwear?: ClothingItem,
  rainGear?: ClothingItem
): string {
  const label = TEMPERATURE_LABEL[level];
  let summary = `今日${weather.location}天氣${label}，氣溫 ${weather.minTemp}–${weather.maxTemp}°C`;

  if (outerwear) {
    summary += `，建議穿著${outerwear.name}`;
  }

  if (rainGear) {
    summary += `。降雨機率 ${weather.rainProbability}%，記得帶${rainGear.name}`;
  }

  summary += "。";
  return summary;
}

/** 主函式：根據天氣產生穿搭建議 */
export function getOutfitRecommendation(
  weather: WeatherData
): OutfitRecommendation {
  const level = getTemperatureLevel(weather.feelsLike);
  const top = getTop(level);
  const bottom = getBottom(level);
  const outerwear = getOuterwear(level);
  const accessories = getAccessories(level, weather.rainProbability);
  const rainGear = getRainGear(weather.rainProbability);
  const summary = generateSummary(level, weather, outerwear, rainGear);

  return {
    top,
    bottom,
    outerwear,
    accessories,
    rainGear,
    summary,
    temperatureLevel: level,
  };
}
