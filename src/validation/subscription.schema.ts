import { z } from "zod";

export const ALERTS = ["temp_high","temp_low","rain","wind","humidity"] as const;
export const TIME_PREFS = ["", "06-12", "12-18", "18-23"] as const;

const phoneRegex = /^\+?[1-9]\d{9,14}$/;
const cityRegex = /^[A-Za-zÀ-ÿ\s]{2,80}$/;

export const subscriptionCreateSchema = z.object({
  phone: z.string()
    .trim()
    .regex(phoneRegex, { message: "Invalid phone format. Use international format like +5511999887766." }),

  city: z.string()
    .trim()
    .regex(cityRegex, { message: "City must contain only letters and spaces." }),

  alerts: z.array(z.enum(ALERTS))
    .min(1, "Select at least one alert type."),

  timePref: z.optional(z.enum(TIME_PREFS)),
  active: z.optional(z.boolean()),
});

export const updateSubscriptionSchema =
  subscriptionCreateSchema.partial().refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
  );
