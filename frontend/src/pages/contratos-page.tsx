import { FaDollarSign, FaFileAlt } from "react-icons/fa";
import ContratosList from "../components/contratos-list";
import { Card, CardContent } from "../components/ui/card";
import { useContratosContext } from "../providers/contratos-provider";
import formataReal from "../utils/formata-real";

export default function ContratosPage() {

  const { contratos } = useContratosContext();

  const totalValue = contratos.reduce((sum, contrato) => sum + contrato.valortotal, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 items-center justify-between md:flex-row">
        <div>
          <h2 className="text-3xl font-extrabold">Contratos</h2>
          <p className="text-muted-foreground mt-2">
            Gerencie e consulte todos os seus contratos e parcelas
          </p>
        </div>
        <Card className="bg-card/50 w-full md:w-max">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {contratos.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de Contratos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FaDollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {formataReal(totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Contratos Ativos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Contratos Concluídos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {2}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ContratosList contratos={contratos} />
    </div>
  );
}
