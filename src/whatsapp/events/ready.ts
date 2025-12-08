import client from "#whatsapp/client";
import chalk from "chalk";

export default () => {
    client.on("ready", () => {
        console.log(`${chalk.green("Whatsapp bot connect")}`);
    });
};
