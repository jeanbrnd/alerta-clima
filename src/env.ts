import z from "zod";

const envSchema = z.object({
   PORT: z.string().optional(),
   DATABASE_URL: z.string({ error: "Database url is required" }).min(1),
});

const env = envSchema.parse(process.env);

export default env;