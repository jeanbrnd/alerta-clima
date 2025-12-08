

interface Location {
  lat: number;
  lon: number;
  displayName: string;
};

interface GetCityCoordinatesData { 
  cityName: string;
  state?: string;
};

export async function getCityCoordinates(data: GetCityCoordinatesData): Promise<Location | undefined | null> {
    
    const { cityName, state } = data;
    const query = state ? `${cityName}, ${state}, Brazil` : `${cityName}, Brazil`;
    const url = `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: "json",
        limit: "10",
        addressdetails: "1"
    });
              
    try {
        const response = await fetch(url, {
             headers: { "User-Agent": "AlertaClimaApp/1.0 (+https://yourapp.com)" }
        });
         
        const data = await response.json();
          
        if (!Array.isArray(data) || data.length === 0) return null;
         
        let bestMatch = data.find((item: any) => item.address.country_code === "br");

       if (bestMatch && state) {
           const stateMatch = data.find((item: any) => {
           const addrState = item.address.state || "";
           return addrState.toLowerCase().includes(state.toLowerCase());  
        });
     
       if (stateMatch) bestMatch = stateMatch;

         bestMatch = bestMatch || data[0];

       return {
         lat: parseFloat(bestMatch.lat),
         lon: parseFloat(bestMatch.lon),
         displayName: bestMatch.display_name
       };
    }
    } catch (error: any) {
        throw new Error(error);
    }
}; 
