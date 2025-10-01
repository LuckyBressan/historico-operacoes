import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import formataReal from "../utils/formata-real"
import { FaHandHoldingDollar } from "react-icons/fa6"
import { FaCalendar, FaDollarSign, FaFileInvoiceDollar } from "react-icons/fa"
import { useContratosContext } from "../providers/contratos-provider"
import type { PeriodoValorAberto } from "../@types/Contrato"

export function ContratosAnalisePage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [periodoValor, setPeriodoValor] = useState<PeriodoValorAberto|null>(null)
  const [showModal, setShowModal] = useState(false)

  const { postMaiorValorAberto } = useContratosContext()

  const calculateMaxDebtPeriod = async () => {
    setIsCalculating(true)

    const data = await postMaiorValorAberto()

    setIsCalculating(false)

    if( data ) {
        setPeriodoValor(data)
        setShowModal(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FaHandHoldingDollar className="h-5 w-5 text-primary" />
            Análise de Período de Maior Valor em Aberto
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Calcule o período com o maior valor acumulado baseado nos contratos ativos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button onClick={calculateMaxDebtPeriod} disabled={isCalculating} size="lg" className="gap-2">
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Calculando...
                </>
              ) : (
                <>
                  <FaDollarSign className="h-4 w-4" />
                  Calcular Período
                </>
              )}
            </Button>
          </div>

          {periodoValor && (
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <FaFileInvoiceDollar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Resultado</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Maior Valor Acumulado</p>
                      <p className="text-2xl font-bold text-primary">{formataReal(periodoValor.total_aberto)}</p>
                    </div>
            
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Período Analisado</p>
                      <p className="text-2xl font-bold text-foreground">{periodoValor.mes_ano}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
