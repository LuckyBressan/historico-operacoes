import { Knex } from "knex";
import { readFile } from "node:fs/promises";
import z from "zod";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("contratos").del();

    try {
        const data = await readFile('../db/historico.json', 'utf-8')

        const parcelaSchema = z.object({
            valorvencimento: z.number().nonoptional(),
            datavencimento: z.date(),
            dataultimopagamento: z.date(),
            totalpago: z.number().nonoptional(),
            capitalaberto: z.number().nonoptional()
        })

        const contratoSchema = z.object({
            contrato: z.string().nonoptional(),
            data: z.date().nonoptional(),
            valortotal: z.number(),
            valorfinanciado: z.number(),
            valorentrada: z.number(),
            parcelas    : z.array(parcelaSchema)
        })

        const contratosSchema = z.array(contratoSchema)

        const contratos = contratosSchema.parse(JSON.parse(data))

        // Inserts seed entries
        await knex("contratos").insert(contratos.map(contrato => ({
            contrato: contrato.contrato,
            data: contrato.data,
            valortotal: contrato.valortotal,
            valorentrada: contrato.valorentrada,
            valorfinanciado: contrato.valorfinanciado,
        })));
    } catch (error) {
        console.log('Erro no povoamento de contratos!')
    }
};
