import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from 'supertest'
import { readFile } from "node:fs/promises";
import type { Contrato } from "../src/@types/contratos";

describe('Contratos routes', () => {

    const mockPath      = new URL("mock/historico-test.json", import.meta.url)
    const mockErrorPath = new URL("mock/historico-test-error.json", import.meta.url)

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        //Restaura o banco de dados
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    describe('Inclusão de contratos', () => {

        it('deve permitir salvar os contratos no banco de dados', async () => {

            const data = await readFile(mockPath, 'utf-8')
            const contratos: Contrato[] = JSON.parse(data)

            await request(app.server)
                .post('/contratos')
                .send(contratos)
                .expect(201)
        })

        it('deve gerar erro, pois o JSON está com formato inválido', async () => {
            const data = await readFile(mockErrorPath, 'utf-8')
            const contratos: Contrato[] = JSON.parse(data)

            await request(app.server)
                .post('/contratos')
                .send(contratos)
                .expect(503)
        })
    })

    describe('Listagem de contratos e parcelas', () => {

        it('deve listar todos os contratos salvos', async () => {
            const contratos = [
                {
                    "contrato": "0500000000000000000001669920210310",
                    "data": "2021-03-10",
                    "valortotal": 842,
                    "valorentrada": 0,
                    "valorfinanciado": 842,
                    "parcelas": [
                        {
                            "valorvencimento": 210.50,
                            "datavencimento": "2021-03-15",
                            "dataultimopagamento": "2021-03-12",
                            "totalpago": 210.50,
                            "capitalaberto": 0
                        },
                        {
                            "valorvencimento": 210.50,
                            "datavencimento": "2021-04-15",
                            "dataultimopagamento": "2021-04-10",
                            "totalpago": 150.00,
                            "capitalaberto": 60.50
                        },
                        {
                            "valorvencimento": 210.50,
                            "datavencimento": "2021-05-15",
                            "dataultimopagamento": "2021-05-08",
                            "totalpago": 0,
                            "capitalaberto": 210.50
                        },
                        {
                            "valorvencimento": 210.50,
                            "datavencimento": "2021-06-15",
                            "dataultimopagamento": null,
                            "totalpago": 0,
                            "capitalaberto": 210.50
                        }
                    ],
                }
            ]

            await request(app.server)
                .post('/contratos')
                .send({
                    contratos: contratos
                })

            const listContratosResponse = await request(app.server)
                .get('/contratos')

            const contratosSemParcela = contratos.map(({ parcelas, ...rest }) => rest)

            expect(listContratosResponse.body.contratos).toEqual(
                expect.arrayContaining(contratosSemParcela)
            )
        })

        it('deve listar todas as parcelas salvas', async () => {

            const parcelas = [
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-03-15",
                    "dataultimopagamento": "2021-03-12",
                    "totalpago": 210.50,
                    "capitalaberto": 0
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-04-15",
                    "dataultimopagamento": "2021-04-10",
                    "totalpago": 150.00,
                    "capitalaberto": 60.50
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-05-15",
                    "dataultimopagamento": "2021-05-08",
                    "totalpago": 0,
                    "capitalaberto": 210.50
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-06-15",
                    "dataultimopagamento": null,
                    "totalpago": 0,
                    "capitalaberto": 210.50
                }
            ]

            const contratos = [
                {
                    "contrato": "0500000000000000000001669920210310",
                    "data": "2021-03-10",
                    "valortotal": 842,
                    "valorentrada": 0,
                    "valorfinanciado": 842,
                    "parcelas": parcelas
                }
            ]

            await request(app.server)
                .post('/contratos')
                .send({
                    contratos: contratos
                })

            const listParcelasResponse = await request(app.server)
                .get('/contratos/parcelas')


            const parcelasExpect = parcelas.map((parcela, key) => ({
                contratoId: contratos[0]?.contrato,
                id: key + 1,
                ...parcela
            }))

            expect(listParcelasResponse.body.parcelas).toEqual(
                expect.arrayContaining(parcelasExpect)
            )
        })

        it('deve listar somente as parcelas do contrato passado por parâmetro da request', async () => {
            const parcelas = [
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-03-15",
                    "dataultimopagamento": "2021-03-12",
                    "totalpago": 210.50,
                    "capitalaberto": 0
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-04-15",
                    "dataultimopagamento": "2021-04-10",
                    "totalpago": 150.00,
                    "capitalaberto": 60.50
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-05-15",
                    "dataultimopagamento": "2021-05-08",
                    "totalpago": 0,
                    "capitalaberto": 210.50
                },
                {
                    "valorvencimento": 210.50,
                    "datavencimento": "2021-06-15",
                    "dataultimopagamento": null,
                    "totalpago": 0,
                    "capitalaberto": 210.50
                }
            ]

            const contratos = [
                {
                    "contrato": "0500000000000000000001669920210310",
                    "data": "2021-03-10",
                    "valortotal": 842,
                    "valorentrada": 0,
                    "valorfinanciado": 842,
                    "parcelas": parcelas
                }
            ]

            await request(app.server)
                .post('/contratos')
                .send({
                    contratos: contratos
                })

            const listParcelasResponse = await request(app.server)
                .get(`/contratos/parcelas/${contratos[0]?.contrato}`)

            const parcelasExpect = parcelas.map((parcela, key) => ({
                contratoId: contratos[0]?.contrato,
                id: key + 1,
                ...parcela
            }))

            expect(listParcelasResponse.body.parcelas).toEqual(
                expect.arrayContaining(parcelasExpect)
            )
        })
    })

    describe('Cálculo de maior valor em aberto', () => {

        it('deve retornar o mês/ano onde o usuário teve o maior valor contratual em aberto', async () => {

            const data = await readFile(mockPath, 'utf-8')
            const contratos: Contrato[] = JSON.parse(data)

            const maiorValorAbertoResponse = await request(app.server)
                .post('/contratos/maiorValorAberto')
                .send(contratos)

            expect(maiorValorAbertoResponse.body).toEqual(
                expect.objectContaining({
                    mes_ano     : "05/2021",
                    total_aberto: 210.5
                })
            )

        })
    })

})