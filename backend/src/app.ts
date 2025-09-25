import fastify from "fastify";
import contratosRoutes from "./routes/contratos";

export const app = fastify()

app.register(contratosRoutes, {
    prefix: 'contratos'
})