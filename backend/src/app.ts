import fastify from "fastify";
import contratosRoutes from "./routes/contratos";
import cors from "@fastify/cors"

export const app = fastify()

app.register(cors, {
    origin: true
})

app.register(contratosRoutes, {
    prefix: 'contratos'
})