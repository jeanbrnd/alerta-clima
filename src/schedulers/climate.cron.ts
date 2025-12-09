import { evaluateAlerts, getDateBR, getMessages, isInsideRange, runInPool, sentInThisRange } from "#functions";
import { sendMessage } from "#whatsapp/functions";
import { CronJob } from "cron";
import db from "database/index.js";
import { getCityWeather } from "functions/utils/climate.js";
import { Subscription } from "../database/generated/prisma/client.js";


async function handlerSubscription(sub: Subscription, now: Date) {
   try {
       if (!isInsideRange(sub.timePref, now)) return;
       if (sentInThisRange(sub.lastSentAt, sub.timePref, now)) return;
      
        const weather = await getCityWeather(sub.city);
        if (!weather) return;

         const triggeredAlerts = evaluateAlerts(weather, sub.alerts);
        if (!triggeredAlerts.length) return;

        const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        const msg = getMessages(sub.city, triggeredAlerts, timeStr);

        await sendMessage({ number: sub.phone, content: msg });

   } catch(err) {
        console.error("Erro ao processar subscription", sub.id, err);
   };
};

const pool = runInPool(3);

export async function startClimateSchedeler(startImmediately?: boolean) {
  const job = new CronJob('0 0 */1 * * *', async () => {
    //pegando horario do brasillll   
    const now = getDateBR(); 
     
    console.log("🔄 Rodando clima", now);
    
    const subs = await db.subscription.getMany({ where: { active: true }});

    await Promise.all(
       subs.map(sub => pool(() => handlerSubscription(sub, now)))
    );
     
  }, null, true, "America/Sao_Paulo");

  if(startImmediately) {
    job.fireOnTick();
  };

  job.start();
};