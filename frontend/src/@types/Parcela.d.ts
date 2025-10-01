export interface Parcela {
  contratoId: string;
  id: number;
  valorvencimento: number;
  datavencimento: string;
  dataultimopagamento?: string;
  totalpago: number;
  capitalaberto: number;
}
