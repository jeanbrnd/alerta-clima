import client from "#whatsapp/client";
import { SendMessageDataProps } from "types/whatsapp.js";

export async function sendMessage(data: SendMessageDataProps) {
      const { number, content } = data;

      try {
        await client.sendMessage(number, content);
      } catch (error: any) {
        throw new Error(error);
      };
};