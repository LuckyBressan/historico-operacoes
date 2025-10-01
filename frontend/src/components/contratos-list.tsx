import type { Contrato } from "../@types/Contrato";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import formataReal from "../utils/formata-real";
import formataData from "../utils/formata-data";
import { useState } from "react";
import type { Parcela } from "../@types/Parcela";
import { useContratosContext } from "../providers/contratos-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import BadgeSituacao from "./badge-situacao";
import { FaCalendar, FaFileAlt } from "react-icons/fa";

type statusParcelaType = 'pago'|'pendente'|'atrasado'

export default function ContratosList({
  contratos,
}: {
  contratos: Contrato[];
}) {
  const [parcelas, setParcelas] = useState<{
    [contratoId in string]: Parcela[];
  }>({});

  const { loadParcelas } = useContratosContext();

  const handleAccordionValueChange = async (contratoId: string) => {
    if (!contratoId || parcelas[contratoId]) return;

    setParcelas({});

    const parcelasContrato = await loadParcelas(contratoId);

    setParcelas({
      [contratoId]: parcelasContrato,
    });
  };

  const getVariantBadgeStatus = (status: statusParcelaType) => {
    switch (status) {
      case 'pago':
        return 'primary'
      case 'pendente':
        return 'secondary'
      case 'atrasado':
        return 'tertiary'
      default:
        return 'none'
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          className="space-y-4"
          onValueChange={handleAccordionValueChange}>
          {contratos.map((contrato) => (
            <AccordionItem
              key={contrato.contrato}
              value={contrato.contrato}
              className="border-0">
              <Card className="bg-card border-border hover:bg-card/80 transition-colors py-0">
                <AccordionTrigger className="hover:no-underline py-0 pr-6">
                  <CardHeader className="w-full px-3 py-6 md:px-6 overflow-hidden">
                    <div
                      className="
                        grid grid-cols-[max-content_1fr] grid-rows-2
                        md:gap-3 md:grid-rows-1 md:grid-cols-[max-content_1fr_1fr] md:items-center md:justify-between
                        w-full overflow-hidden
                      "
                    >
                      <div
                        className="
                          p-3 w-max h-max bg-primary/20 rounded-lg hidden row-span-2
                          md:block md:col-1 md:row-span-1
                        "
                      >
                        <FaFileAlt className="h-6 w-6 text-primary" />
                      </div>
                      <div className="col-2 flex items-center gap-4 w-full overflow-hidden">
                        <div className="text-left w-full">
                          <CardDescription className="texto-small text-muted-foreground">
                            Código do Contrato
                          </CardDescription>
                          <CardTitle className="code-normal-bold text-foreground overflow-ellipsis overflow-hidden">
                            {contrato.contrato}
                          </CardTitle>
                        </div>
                      </div>

                      <div className="col-2 md:col-3 md:justify-self-end flex items-center gap-6">
                        <div className="md:text-right">
                          <p className="texto-small text-muted-foreground">
                            Valor Total
                          </p>
                          <p className="texto-bold text-foreground">
                            {formataReal(contrato.valortotal)}
                          </p>
                        </div>

                        <div className="md:text-right">
                          <p className="texto-small text-muted-foreground">
                            Data do Contrato
                          </p>
                          <p className="texto-bold text-foreground">
                            {formataData(contrato.data)}
                          </p>
                        </div>

                        {/* <Badge
                          className={cn(
                            "capitalize",
                            getStatusColor(contract.status)
                          )}>
                          {contract.status}
                        </Badge> */}
                      </div>
                    </div>
                  </CardHeader>
                </AccordionTrigger>

                <AccordionContent className="p-0">
                  <CardContent className="pt-0 pb-6 px-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaCalendar className="h-4 w-4" />
                        <span>Parcelas do Contrato</span>
                      </div>

                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader className="bg-background">
                            <TableRow>
                              <TableHead className="text-primary font-bold uppercase">
                                Parcela
                              </TableHead>
                              <TableHead className="text-primary font-bold uppercase">
                                Vencimento
                              </TableHead>
                              <TableHead className="text-primary font-bold uppercase">
                                Valor
                              </TableHead>
                              <TableHead className="text-primary font-bold uppercase">
                                Status
                              </TableHead>
                              <TableHead className="text-primary font-bold uppercase">
                                Saldo Restante
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parcelas[contrato.contrato]?.map((parcela, id) => {
                              const parcelaPendente = parcela.capitalaberto > 0

                              const dataVencimento = new Date(parcela.datavencimento)

                              let status: statusParcelaType = parcelaPendente
                                ? 'pendente'
                                : 'pago'

                              if(
                                parcelaPendente &&
                                (new Date()) > dataVencimento
                              ) {
                                status = 'atrasado'
                              }

                              return (
                                <TableRow
                                  key={parcela.id}
                                  className="hover:bg-muted/30">
                                  <TableCell className="text-foreground">
                                    {id + 1}
                                  </TableCell>
                                  <TableCell className="text-foreground">
                                    {formataData(parcela.datavencimento)}
                                  </TableCell>
                                  <TableCell className="text-foreground">
                                    {formataReal(parcela.valorvencimento)}
                                  </TableCell>
                                  <TableCell>
                                    <BadgeSituacao
                                      className="capitalize"
                                      variant={getVariantBadgeStatus(status)}
                                    >
                                      {status}
                                    </BadgeSituacao>
                                  </TableCell>
                                  <TableCell className="text-foreground">
                                    {formataReal(parcela.capitalaberto)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
