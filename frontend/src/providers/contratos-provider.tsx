import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import type { ContratoParcela, ContratoStatus, PeriodoValorAberto } from "../@types/Contrato";
import type { AxiosResponse } from "axios";
import type { Parcela } from "../@types/Parcela";
import { ContratoStatusEnum } from "../enum/contrato-status-enum";

interface ContratosContextType {
  contratos: ContratoStatus[];
  loadParcelas: (contratoId: string) => Promise<Parcela[]>;
  postContratos: (contratos: {
    contratos: ContratoParcela[];
  }) => Promise<AxiosResponse>;
  postMaiorValorAberto: () => Promise<PeriodoValorAberto | void>;
}

const ContratosContext = createContext<ContratosContextType | undefined>(
  undefined
);

export function useContratosContext() {
  const context = useContext(ContratosContext);
  if (!context) {
    throw new Error(
      "useContratosContext deve ser usado dentro de ContratosProvider"
    );
  }
  return context;
}

export default function ContratosProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [contratos, setContratos] = useState<ContratoStatus[]>([]);

  const loadContratos = () => {
    return api
      .get("/contratos")
      .then((res: AxiosResponse<{ contratos: ContratoStatus[] }>) =>
        setContratos(res.data.contratos)
      )
      .catch((err) => console.error("Erro ao carregar contratos: ", err));
  };

  const loadParcelas = async (contratoId: string) => {
    return api
      .get(`/contratos/parcelas/${contratoId}`)
      .then((res: AxiosResponse<{ parcelas: Parcela[] }>) => res.data.parcelas);
  };

  const postContratos = (contratos: { contratos: ContratoParcela[] }) => {
    return api
      .post("/contratos", contratos)
      .then((res) => {
        setContratos(
          contratos.contratos.map<ContratoStatus>((contrato) => {

            const status = contrato.parcelas.some(parcela => parcela.capitalaberto > 0)
              ? ContratoStatusEnum.ATIVO
              : ContratoStatusEnum.CONCLUIDO

            return {
              contrato: contrato.contrato,
              data: contrato.data,
              valorentrada: contrato.valorentrada,
              valorfinanciado: contrato.valorfinanciado,
              valortotal: contrato.valortotal,
              status
            }
          })
        );
        return res;
      })
      .catch((err) => {
        console.error("Erro ao carregar contratos: ", err);
        return err;
      });
  };

  const postMaiorValorAberto = () => {
    return api
      .post('/contratos/maiorValorAberto')
      .then((res: AxiosResponse<PeriodoValorAberto>) => res.data)
      .catch(err => console.error('Erro ao analisar maior valor em aberto: ', err))
  }

  useEffect(() => {
    loadContratos();
  }, []);

  return (
    <ContratosContext.Provider
      value={{
        contratos,
        loadParcelas,
        postContratos,
        postMaiorValorAberto
      }}>
      {children}
    </ContratosContext.Provider>
  );
}
