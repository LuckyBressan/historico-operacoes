import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { database } from "../database";
import type { Contrato, ContratoSelect } from "../@types/contratos";
import type { HistoricoParcelaAberto } from "../@types/generics";

/**
 * Método que retorna todos os contratos salvos no banco de dados
 */
export async function getContratos(
    req: FastifyRequest,
    res: FastifyReply
) {
    const contratos: ContratoSelect[] = await database('contratos as c')
        .select(
            'c.*',
            database.raw(`
                COALESCE((
                    SELECT 1
                      FROM parcelas p
                     WHERE p.contratoId = c.contrato AND p.capitalaberto > 0
                     LIMIT 1
                ), 0) as status
            `)
        )
        .orderBy('data', 'desc')

    return { contratos }
}

/**
 * Método que retorna todas as parcelas do contrato passado por parâmetro
 */
export async function getContratoParcelas(
    req: FastifyRequest,
    res: FastifyReply
) {

    const getContratoParcelasParamsSchema = z.object({
        contratoId: z.string()
    })

    const { contratoId } = getContratoParcelasParamsSchema.parse(req.params)

    const parcelas = await database('parcelas').where({ contratoId })

    return { parcelas }
}

/**
 * Métdo que retorna todas as parcelas salvas no banco de dados
 */
export async function getParcelas(
    req: FastifyRequest,
    res: FastifyReply
) {
    const parcelas = await database('parcelas')

    return { parcelas }
}

/**
 * Método que insere os contratos e parcelas no banco de dados a partir de um JSON de dados enviados no body
 */
async function insertContratosParcelas(
    req: FastifyRequest
) : Promise<{
    sucesso : boolean;
    resposta?: unknown;
}> {
    const postParcelaSchema = z.object({
        valorvencimento: z.number().nonoptional(),
        datavencimento: z.string(),
        dataultimopagamento: z.string().optional().nullable(),
        totalpago: z.number(),
        capitalaberto: z.number(),
    });

    const postContratoSchema = z.object({
        contrato: z.string().nonoptional(),
        data: z.string(),
        valortotal: z.number(),
        valorfinanciado: z.number(),
        valorentrada: z.number(),
        parcelas: z.array(postParcelaSchema).optional(),
    });

    const postContratosBodySchema = z.object({
        contratos: z.array(postContratoSchema),
    });

    let contratos;

    try {
        //Validamos se o JSON de dados veio estruturado corretamente
        const { contratos: contratosBody } = postContratosBodySchema.parse(req.body);
        contratos = contratosBody
    } catch (error) {
        return { sucesso: false, resposta: error }
    }

    //Deletamos todos os registros anteriores
    //No momento vamos apenas trabalhar com um conjunto de dados por vez
    await database("contratos").del();
    await database("parcelas").del();

    for(let contrato of contratos) {
        const { parcelas } = contrato;
        try {
            //objeto de contrato contém parcelas, porém não podemos passar parcelas no insert de contratos
            await database("contratos").insert({
                contrato: contrato.contrato,
                data: contrato.data,
                valorentrada: contrato.valorentrada,
                valorfinanciado: contrato.valorfinanciado,
                valortotal: contrato.valortotal
            });
            if (parcelas) {
                await database("parcelas").insert(
                    parcelas.map((parcela) => ({
                        contratoId: contrato.contrato,
                        ...parcela,
                    }))
                );
            }
        } catch (error) {
            return { sucesso: false, resposta: error }
        }
    }

    return { sucesso: true }
}

/**
 * Método POST que recebe um JSON de dados na requisição e insere no banco de dados
 */
export async function postContratos(
    req: FastifyRequest,
    res: FastifyReply
) {

    const resposta = await insertContratosParcelas(req)

    resposta.sucesso
        ? res.code(201).send(resposta)
        : res.code(503).send(resposta)
}

/**
 * Método POST que calcula o mês de maior valor em aberto (parcelas) de uma pessoa
 * Caso seja enviado um JSON de dados no body, o banco de dados será atualizado para levar este JSON em consideração
 */
export async function postMaiorValorAberto(
    req: FastifyRequest<{ Body: { contratos?: Contrato[] } }>,
    res: FastifyReply
) {

    // Caso seja passado um JSON de dados no body, atualizamos o banco de dados considerando este JSON
    if( req.body?.contratos ) {
        const resposta = await insertContratosParcelas(req)

        if( !resposta.sucesso ) {
            res.code(503).send(resposta)
        }
    }

    //Buscamos todos os anos que houveram contratos/parcelas
    const anos = await database('parcelas')
        .select<[{ ano: string }]>(database.raw("DISTINCT strftime('%Y', datavencimento) as ano"))
        .orderBy('ano')

    let maiorHistoricoParcelaAberto: HistoricoParcelaAberto = { mes_ano: '', total_aberto: 0 }

    //percorremos ano a ano, procurando qual mês teve o maior valor em aberto
    for(let { ano } of anos) {
        (
            await database('parcelas')
                .select(
                    database.raw("strftime('%m', datavencimento) || '/' || strftime('%Y', datavencimento) as mes_ano"),
                    database.raw("SUM(capitalaberto) as total_aberto")
                )
                .whereRaw("strftime('%Y', datavencimento) = ?", [ano]) //
                .groupBy('mes_ano')
                .orderBy('mes_ano')
        )
        .map((row: any) => {
            //Valida qual o mês de maior valor em aberto e armazena
            if( row.total_aberto > maiorHistoricoParcelaAberto.total_aberto ) {
                maiorHistoricoParcelaAberto = row
            }
        })
    }

    res.code(200).send(maiorHistoricoParcelaAberto)

}