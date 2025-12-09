
export async function getCoordinates(cityName: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url, { headers: { "User-Agent": "AlertaClima/1.0" } });
    const data = await res.json() as any;
    
    if (!data.length) return null;

    // Pega o primeiro resultado
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  } catch (err) {
    console.error("Erro ao buscar coordenadas:", err);
    return null;
  }
}
