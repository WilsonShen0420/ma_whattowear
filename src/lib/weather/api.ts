import { WeatherData } from "./types";

// 縣市對應的CWA資料集編號 (一般天氣預報-今明36小時天氣預報)
const LOCATION_DATASET = "F-C0032-001";

// 縣市名稱列表（用於座標對應）
const TAIWAN_CITIES = [
  { name: "基隆市", lat: 25.1276, lng: 121.7392 },
  { name: "臺北市", lat: 25.0330, lng: 121.5654 },
  { name: "新北市", lat: 25.0120, lng: 121.4657 },
  { name: "桃園市", lat: 24.9936, lng: 121.3010 },
  { name: "新竹市", lat: 24.8138, lng: 120.9675 },
  { name: "新竹縣", lat: 24.8390, lng: 121.0046 },
  { name: "苗栗縣", lat: 24.5602, lng: 120.8214 },
  { name: "臺中市", lat: 24.1477, lng: 120.6736 },
  { name: "彰化縣", lat: 24.0752, lng: 120.5161 },
  { name: "南投縣", lat: 23.9610, lng: 120.6719 },
  { name: "雲林縣", lat: 23.7092, lng: 120.4313 },
  { name: "嘉義市", lat: 23.4801, lng: 120.4491 },
  { name: "嘉義縣", lat: 23.4518, lng: 120.2551 },
  { name: "臺南市", lat: 22.9998, lng: 120.2269 },
  { name: "高雄市", lat: 22.6273, lng: 120.3014 },
  { name: "屏東縣", lat: 22.5519, lng: 120.5487 },
  { name: "宜蘭縣", lat: 24.7021, lng: 121.7378 },
  { name: "花蓮縣", lat: 23.9871, lng: 121.6016 },
  { name: "臺東縣", lat: 22.7583, lng: 121.1444 },
  { name: "澎湖縣", lat: 23.5711, lng: 119.5793 },
  { name: "金門縣", lat: 24.4493, lng: 118.3767 },
  { name: "連江縣", lat: 26.1505, lng: 119.9499 },
];

/** 根據經緯度找到最近的縣市 */
export function findNearestCity(lat: number, lng: number): string {
  let minDist = Infinity;
  let nearest = "臺北市";

  for (const city of TAIWAN_CITIES) {
    const dist = Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = city.name;
    }
  }

  return nearest;
}

/** 從 CWA API 取得天氣資料 */
export async function fetchWeatherFromCWA(
  apiKey: string,
  locationName: string
): Promise<{ today: WeatherData; tomorrow: WeatherData }> {
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${LOCATION_DATASET}?Authorization=${apiKey}&locationName=${encodeURIComponent(locationName)}`;

  const res = await fetch(url, { next: { revalidate: 1800 } }); // 快取 30 分鐘

  if (!res.ok) {
    throw new Error(`CWA API error: ${res.status}`);
  }

  const data = await res.json();
  return parseCWAResponse(data, locationName);
}

/** 解析 CWA API 回應 */
function parseCWAResponse(
  data: Record<string, unknown>,
  locationName: string
): { today: WeatherData; tomorrow: WeatherData } {
  const records = data.records as {
    location: Array<{
      locationName: string;
      weatherElement: Array<{
        elementName: string;
        time: Array<{
          startTime: string;
          endTime: string;
          parameter: { parameterName: string; parameterValue?: string };
        }>;
      }>;
    }>;
  };

  const location = records.location[0];
  if (!location) {
    throw new Error(`No data for location: ${locationName}`);
  }

  const getElement = (name: string) =>
    location.weatherElement.find((e) => e.elementName === name);

  const wx = getElement("Wx");       // 天氣現象
  const pop = getElement("PoP");     // 降雨機率
  const minT = getElement("MinT");   // 最低溫
  const maxT = getElement("MaxT");   // 最高溫
  const ci = getElement("CI");       // 舒適度

  // 時段 0 = 今天, 時段 1 或 2 = 明天
  const buildWeather = (
    idx: number,
    date: "today" | "tomorrow"
  ): WeatherData => {
    const temp_min = parseInt(minT?.time[idx]?.parameter.parameterName ?? "20");
    const temp_max = parseInt(maxT?.time[idx]?.parameter.parameterName ?? "28");
    const avgTemp = Math.round((temp_min + temp_max) / 2);

    return {
      location: locationName,
      date,
      temperature: avgTemp,
      feelsLike: avgTemp, // CWA 36小時預報無體感溫度，以均溫代替
      minTemp: temp_min,
      maxTemp: temp_max,
      rainProbability: parseInt(pop?.time[idx]?.parameter.parameterName ?? "0"),
      weatherDesc: wx?.time[idx]?.parameter.parameterName ?? "晴",
    };
  };

  return {
    today: buildWeather(0, "today"),
    tomorrow: buildWeather(Math.min(1, (wx?.time.length ?? 1) - 1), "tomorrow"),
  };
}

/** Mock 天氣資料（API Key 尚未設定時使用） */
export function getMockWeather(locationName: string): {
  today: WeatherData;
  tomorrow: WeatherData;
} {
  return {
    today: {
      location: locationName,
      date: "today",
      temperature: 24,
      feelsLike: 23,
      minTemp: 21,
      maxTemp: 27,
      rainProbability: 30,
      weatherDesc: "多雲時晴",
    },
    tomorrow: {
      location: locationName,
      date: "tomorrow",
      temperature: 19,
      feelsLike: 17,
      minTemp: 16,
      maxTemp: 22,
      rainProbability: 70,
      weatherDesc: "陰時多雲短暫雨",
    },
  };
}
