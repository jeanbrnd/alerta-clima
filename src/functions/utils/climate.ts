import { fetchWeather, getCoordinates } from "../lib/index.js";


export async function getCityWeather(cityName: string) {
  const coords = await getCoordinates(cityName);
  if (!coords) {
    console.error("Não foi possível localizar a cidade:", cityName);
    return null;
  }

  const weather = await fetchWeather(coords.lat, coords.lon);
  if (!weather) return null;

  return weather;
}
