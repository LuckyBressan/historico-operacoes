import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("contratos", (table) => {
        table.string("contrato").primary();
        table.date("data").notNullable();
        table.decimal("valortotal", 15, 2).notNullable();
        table.decimal("valorentrada", 15, 2).notNullable();
        table.decimal("valorfinanciado", 15, 2).notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("contratos")
}

