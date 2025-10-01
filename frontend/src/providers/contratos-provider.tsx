import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import type { Contrato } from "../@types/Contrato";
import type { AxiosResponse } from "axios";
import type { Parcela } from "../@types/Parcela";

interface ContratosContextType {
  contratos: Contrato[];
  loadParcelas: (contratoId: string) => Promise<Parcela[]>
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
  const [contratos, setContratos] = useState<Contrato[]>([]);

  const loadContratos = () => {
    return api
      .get("/contratos")
      .then((res: AxiosResponse<{ contratos: Contrato[] }>) =>
        setContratos(res.data.contratos)
      )
      .catch((err) => console.error("Erro ao carregar contratos: ", err));
  };

  const loadParcelas = (contratoId: string) => {
    return api
      .get(`/contratos/parcelas/${contratoId}`)
      .then(
        (res: AxiosResponse<{ parcelas: Parcela[] }>) => res.data.parcelas
      );
  };

  useEffect(() => {
    loadContratos();
  }, []);

  return (
    <ContratosContext.Provider
      value={{
        contratos,
        loadParcelas
      }}>
      {children}
    </ContratosContext.Provider>
  );
}
