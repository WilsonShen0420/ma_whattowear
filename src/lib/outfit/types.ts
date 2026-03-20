export type ClothingCategory =
  | "top"
  | "bottom"
  | "outerwear"
  | "accessory"
  | "rainGear";

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
}

export interface OutfitRecommendation {
  top: ClothingItem;
  bottom: ClothingItem;
  outerwear?: ClothingItem;
  accessories: ClothingItem[];
  rainGear?: ClothingItem;
  summary: string;
  temperatureLevel: TemperatureLevel;
}

export type TemperatureLevel =
  | "scorching"   // ≥ 33°C 酷熱
  | "hot"         // 28-32°C 炎熱
  | "warm"        // 23-27°C 溫暖
  | "cool"        // 18-22°C 涼爽
  | "chilly"      // 13-17°C 偏冷
  | "cold"        // 8-12°C 冷
  | "freezing";   // ≤ 7°C 嚴寒
