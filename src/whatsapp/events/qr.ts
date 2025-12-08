import client from "#whatsapp/client";
import qrcode from "qrcode-terminal";

export default () => {
    client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
    });
};
