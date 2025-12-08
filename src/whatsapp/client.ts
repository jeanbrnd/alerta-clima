import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg, { Client } from "whatsapp-web.js";
const { LocalAuth } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionPath = path.resolve(__dirname, "../../sessions");

if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
}

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "AlertaClima",
        dataPath: sessionPath,
    }),
    
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});


export default client;
