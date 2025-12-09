import { zodHandlerError } from "#functions";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import ck from "chalk";
import ejs from "ejs";
import fastify, { type FastifyInstance } from "fastify";
import console from "node:console";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function gracefulShutdown(signal: NodeJS.Signals, app: FastifyInstance){
    console.log(ck.yellow(`● ${signal} signal received: closing HTTP server`));
    app.close()
        .then(() => {
            console.log(ck.green("Server closed successfully"));
            process.exit(0);
        })
        .catch(err => {
            console.log(ck.red("Server closed Error"), err);
            process.exit(1);
        });
};

export async function startServer(){
    
    const app = fastify();
    
    app.addHook("onRoute", route => {
        if (route.method === "HEAD" || route.method === "OPTIONS") return;
        console.log(`${ck.yellow(route.method)} ${ck.blue(route.path)}`);
    });
    
    app.register(autoload, {
        dir: path.join(path.resolve(), "src/routes"),
        routeParams: true,
    });

    app.register(cors, {
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "x-api-key"]
    })

    app.setErrorHandler(zodHandlerError);
   
    app.register(fastifyView, {
         engine: {
             ejs
         },
         defaultContext: {
              apiUrl: "http://localhost:3000"
         },
         production: process.env.NODE_ENV === "production",
         root: path.join(__dirname, "../views"),
    });

    app.register(fastifyStatic, {
         root: path.join(__dirname, "../public"),
    });
     
    const port = Number(process.env.PORT ?? 3000);

    await app.listen({ port, host: "0.0.0.0" })
    .catch((err: any) => {
        console.error(err);
        process.exit(1);
    });
    
    console.log(ck.green(`● ${ck.underline("Fastify")} server listening on port ${port}`));

    process.on("SIGINT", () => gracefulShutdown("SIGINT", app));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM", app));
};

export type RouteHandler = (app: FastifyInstance) => any;
export function defineRoutes(handler: RouteHandler){
    return (...[app]: Parameters<RouteHandler>) => {
        handler(app);
    }
};

