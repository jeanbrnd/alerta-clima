import { AlertKey } from "./messages.js";

export function evaluateAlerts(
  weather: any,
  userAlerts: AlertKey[]
): AlertKey[] {  
  const rules: Record<AlertKey, boolean> = {
    temp_high: weather.temp > 32,
    temp_low: weather.temp < 10,
    rain: weather.rain > 2,
    wind: weather.wind > 30,
    humidity: weather.humidity > 80,
    snow: weather.temp < 0 && weather.rain > 0,
    cloud: weather.cloud > 70,
    uv: weather.uv > 7,
  };

  return userAlerts.filter(a => rules[a]);
}
