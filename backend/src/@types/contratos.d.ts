import { Knex } from "knex";
import type { Parcela } from "./parcelas";

export interface Contrato {
    contrato: string;
    data: string;
    valortotal: number;
    valorfinanciado: number;
    valorentrada: number;
    parcelas?: Parcela[];
}

declare module "knex/types/tables" {
  export interface Tables {
    contratos: Omit<Contrato, 'parcelas'>;
  }
}