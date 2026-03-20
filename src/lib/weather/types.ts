export interface WeatherData {
  location: string;
  date: "today" | "tomorrow";
  temperature: number;       // 氣溫 (°C)
  feelsLike: number;         // 體感溫度 (°C)
  minTemp: number;           // 最低溫
  maxTemp: number;           // 最高溫
  rainProbability: number;   // 降雨機率 (0-100)
  weatherDesc: string;       // 天氣描述
  uvIndex?: number;          // 紫外線指數
}

export interface CWALocationMap {
  [key: string]: string;     // 縣市名稱 -> 資料集編號
}
