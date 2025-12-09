import { startClimateSchedeler } from "#schedulers";
import { startServer } from "#server";
import { startWhatsClient } from "#whatsapp";

startServer();
startWhatsClient();
startClimateSchedeler(true);