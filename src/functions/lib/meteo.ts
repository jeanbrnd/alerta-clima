


export async function fetchWeather(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,rain,wind_speed_10m,humidity_2m,cloudcover,uv_index`;
    const res = await fetch(url);
    const data = await res.json() as any;

    return {
      temp: data.current_weather.temperature,
      wind: data.current_weather.windspeed,
      rain: data.current_weather.precipitation,
      humidity: data.hourly?.humidity_2m?.[0] ?? 0,
      cloud: data.hourly?.cloudcover?.[0] ?? 0,
      uv: data.hourly?.uv_index?.[0] ?? 0
    };
  } catch (err) {
    console.error("Erro ao buscar clima:", err);
    return null;
  }
}
