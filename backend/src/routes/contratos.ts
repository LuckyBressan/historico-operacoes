import type { FastifyInstance } from "fastify";
import { getContratoParcelas, getContratos, getParcelas, postContratos, postMaiorValorAberto } from "../controllers/contratos-controller";

export default async function contratosRoutes(app: FastifyInstance) {

    app.get(
        '/',
        getContratos
    )

    app.get(
        '/parcelas/:contratoId',
        getContratoParcelas
    )

    app.get(
        '/parcelas',
        getParcelas
    )

    app.post(
        '/maiorValorAberto',
        postMaiorValorAberto
    )

    app.post(
        '/',
        postContratos
    )
}