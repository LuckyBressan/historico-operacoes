import type { ContratoStatusEnum } from "../enum/contrato-status-enum";
import type { Parcela } from "./Parcela";

export interface Contrato {
  contrato: string;
  data: string;
  valortotal: number;
  valorentrada: number;
  valorfinanciado: number;
}

export interface ContratoParcela extends Contrato {
  parcelas: Parcela[];
}

export interface ContratoStatus extends Contrato {
  status: ContratoStatusEnum;
}

export interface PeriodoValorAberto {
    mes_ano: string;
    total_aberto: number;
}