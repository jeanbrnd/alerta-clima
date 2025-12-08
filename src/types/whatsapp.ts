import WAWebJS from "whatsapp-web.js";

export interface SendMessageDataProps { 
  number: string;
  content: WAWebJS.MessageContent
};
