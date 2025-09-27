import { Knex } from "knex";

export interface Parcela {
  valorvencimento: number;
  datavencimento: string;
  dataultimopagamento: string | null | undefined;
  totalpago: number;
  capitalaberto: number;
}

interface ParcelaTable extends Parcela {
    id: number;
    contratoId: string;
}

declare module "knex/types/tables" {
  export interface Tables {
    parcelas: ParcelaTable;
  }
}
