import { app } from "./app";
import { env } from "./env";

app
    .listen({
        port: env.PORT,
        host: '0.0.0.0'
    })
    .then(url => {
        console.log(`Server listening in ${url}`)
    })