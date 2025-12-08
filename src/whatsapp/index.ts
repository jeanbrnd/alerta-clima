import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import client from "./client.js";

export const startWhatsClient = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const eventsPath = path.join(__dirname, "events");
    const files = fs.readdirSync(eventsPath);

    for (const file of files) {
        const filePath = path.join(eventsPath, file);
        const fileUrl = pathToFileURL(filePath).href; 
        const eventModule = await import(fileUrl);

        if (eventModule.default) {
            eventModule.default();
        }
    }

    client.initialize();
};
