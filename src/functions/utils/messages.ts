export type AlertKey =
  | "temp_high"
  | "temp_low"
  | "rain"
  | "wind"
  | "humidity"
  | "snow"
  | "cloud"
  | "uv";

interface Messages {
  header: string;
  alerts: Record<AlertKey, string>;
  footer: string;
}

export function getMessages(city: string, alertKeys: AlertKey[], time: string): string {
  const messages: Messages = {
    header: `🌤️ *Alerta de Clima – ${city}*`,
    alerts: {
      temp_high: "Temperatura muito alta",
      temp_low: "Temperatura muito baixa",
      rain: "Chuva intensa prevista",
      wind: "Ventos fortes",
      humidity: "Umidade muito alta",
      snow: "Risco de neve",
      cloud: "Alta cobertura de nuvens",
      uv: "Índice UV perigoso"
    },
    footer: `⏱ Atualizado às ${time}`
  };

  const list = alertKeys.map(a => `• ${messages.alerts[a]}`);
  return [messages.header, "", ...list, "", messages.footer].join("\n");
};
