import { defineRoutes } from "#server";
import { type FastifyInstance } from "fastify";

export default defineRoutes((app: FastifyInstance) => {
    app.get("/", async (_req, reply) => {
        return reply.view("home.ejs")
    });
});