import { subscriptionCreateController } from "#controllers";
import { defineRoutes } from "#server";
import { type FastifyInstance } from "fastify";

export default defineRoutes((app: FastifyInstance) => {
     app.post("/", subscriptionCreateController);
     
});