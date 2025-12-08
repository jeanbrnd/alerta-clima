import { CronJob } from "cron";


export async function ClimateSchedelerStart() {
   const job = new CronJob('* * * * * *', async () => {
	   
  });
};