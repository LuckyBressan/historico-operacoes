# Backend de Histórico de Parcelas

### 🛠️ Stack Tecnológica

* [Fastify](https://fastify.dev) — servidor HTTP rápido e minimalista
* [TypeScript](https://www.typescriptlang.org) — tipagem estática para maior confiabilidade
* [Knex.js](https://knexjs.org) — query builder para banco de dados
* [SQLite](https://sqlite.org) — banco de dados leve e embarcado
* [Vitest](https://vitest.dev) — testes automatizados

### 🚀 Funcionalidades Principais

* Listagem de contratos e suas parcelas

- Inserção de novos contratos a partir de um JSON de dados
- Persistência em banco SQLite
- Endpoint que permite:

  * Calcular o **mês/ano com maior valor em aberto** a partir de um JSON fornecido no request
  * Ou utilizar os dados já existentes no banco para o mesmo cálculo

### 📂 Estrutura de Pastas

```Shell
    src/
    ├── routes/          # Definição das rotas da API
    ├── controllers/     # Lógica de cada endpoint
    ├── services/        # Regras de negócio (ex: cálculos de parcelas)
    ├── db/              # Configuração do knex + migrations
    ├── tests/           # Testes com vitest
    ├── app.ts           # Configuração do Fastify
    └── server.ts        # Inicialização do servidor
```

### 📌 Endpoints

##### 🔹Listar contratos

GET `/contratos`

Retorna todos os contratos cadastrados no banco.

**Exemplo de resposta:**

```JSON
{
	"contratos": [
		{
			"contrato": "0500000000000000000001669920210310",
			"data": "2021-03-10",
			"valortotal": 842,
			"valorentrada": 0,
			"valorfinanciado": 842
		},
		{
			"contrato": "0500001240004830000001669920190815",
			"data": "2019-08-15",
			"valortotal": 195.9,
			"valorentrada": 0,
			"valorfinanciado": 195.9
		},
		{
			"contrato": "0500001350004830000001669920191202",
			"data": "2019-12-02",
			"valortotal": 600,
			"valorentrada": 0,
			"valorfinanciado": 600
		}
	]
}
```

##### 🔹Listar parcelas

GET `/contratos/parcelas`

Retorna todos as parcelas cadastradas no banco.

**Exemplo de resposta:**

```JSON
{
	"parcelas": [
		{
			"id": 15811,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-03-15",
			"dataultimopagamento": "2021-03-12",
			"totalpago": 210.5,
			"capitalaberto": 0
		},
		{
			"id": 15812,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-04-15",
			"dataultimopagamento": "2021-04-10",
			"totalpago": 150,
			"capitalaberto": 60.5
		},
		{
			"id": 15813,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-05-15",
			"dataultimopagamento": "2021-05-08",
			"totalpago": 0,
			"capitalaberto": 210.5
		}
    ]
}
```

##### 🔹Listar parcelas de um contrato

GET `/contratos/parcelas/:contratoId`

Retorna todos as parcelas do contrato passado por parâmetro

**Exemplo de resposta:**

```JSON
{
	"parcelas": [
		{
			"id": 15811,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-03-15",
			"dataultimopagamento": "2021-03-12",
			"totalpago": 210.5,
			"capitalaberto": 0
		},
		{
			"id": 15812,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-04-15",
			"dataultimopagamento": "2021-04-10",
			"totalpago": 150,
			"capitalaberto": 60.5
		},
		{
			"id": 15813,
			"contratoId": "0500000000000000000001669920210310",
			"valorvencimento": 210.5,
			"datavencimento": "2021-05-15",
			"dataultimopagamento": "2021-05-08",
			"totalpago": 0,
			"capitalaberto": 210.5
		}
    ]
}
```

##### 🔹Adicionar contratos

POST `/contratos`

Recebe um JSON com contratos e parcelas e os salva no banco.

**Exemplo de dados enviados:**

```JSON
{
  "contratos": [
    {
      "parcelas": [
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-06-22",
          "dataultimopagamento": "2019-06-10",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-07-22",
          "dataultimopagamento": "2019-07-10",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-08-22",
          "dataultimopagamento": "2019-08-10",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-09-22",
          "dataultimopagamento": "2019-09-11",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-10-22",
          "dataultimopagamento": "2019-10-04",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-11-22",
          "dataultimopagamento": "2019-11-07",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2019-12-22",
          "dataultimopagamento": "2019-12-03",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2020-01-22",
          "dataultimopagamento": "2020-01-10",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2020-02-22",
          "dataultimopagamento": "2020-02-12",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2020-03-22",
          "dataultimopagamento": "2020-03-17",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2020-04-22",
          "dataultimopagamento": "2020-03-17",
          "totalpago": 148.78,
          "capitalaberto": 0
        },
        {
          "valorvencimento": 148.78,
          "datavencimento": "2020-05-22",
          "dataultimopagamento": "2020-03-17",
          "totalpago": 148.78,
          "capitalaberto": 0
        }
      ],
      "contrato": "0480000000000000000001669920190508",
      "data": "2019-05-08",
      "valortotal": 1785.36,
      "valorentrada": 0,
      "valorfinanciado": 1785.36
    },
  ]
}
```

##### 🔹 Calcular mês/ano com maior valor em aberto

POST `/contratos/maiorValorAberto`

* Se enviado um JSON no corpo, utiliza esse JSON para o cálculo.

* Se não for enviado, utiliza os dados já salvos no banco.

**Exemplo de resposta:**

```JSON
{
  "mes_ano": "05/2021",
  "total_aberto": 210.50
}
```

### 🧪 Testes Automatizados

* Escritos com Vitest

* Cobrem rotas principais:
  * Inserção de contratos
  * Listagem de contratos/parcelas
  * Cálculo de maior valor em aberto

**Exemplo de teste (Vitest):**

```TypeScript
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
    }
)
```

### ⚙️ Configuração do Banco

* Banco: **SQLite**

* Migrations gerenciadas pelo `knex`

* Arquivo de configuração: `database.ts`

**Exemplo de configuração:**

```ts
import knex, { type Knex } from "knex";
import { env } from "./env";

export const configKnex: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const database = knex(configKnex);
```

### ▶️ Como rodar o projeto

1. Instalar dependências

```shell
npm install
```

2. Rodar migrations

```shell
npm run knex migrate:latest
```

3. Rodar em desenvolvimento

```shell
npm run dev
```

4. Rodar testes

```shell
npm run test
```