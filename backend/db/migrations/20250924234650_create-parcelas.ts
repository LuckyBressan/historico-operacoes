import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("parcelas", (table) => {
        table.increments("id");
        table.string("contratoId").notNullable().references("contrato").inTable("contratos").onDelete("CASCADE");
        table.primary(['id', 'contratoId']) //definimos como uma chave primaria composta
        table.decimal("valorvencimento", 15, 2).notNullable();
        table.date("datavencimento").notNullable();
        table.date("dataultimopagamento").nullable();
        table.decimal("totalpago", 15, 2).notNullable();
        table.decimal("capitalaberto", 15, 2).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("parcelas")
}

