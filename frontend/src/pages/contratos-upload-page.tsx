import {
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaFileUpload,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import React, { useRef, useState } from "react";
import { cn } from "../lib/utils";
import * as z from "zod";
import { useContratosContext } from "../providers/contratos-provider";

export default function ContratosUploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { postContratos } = useContratosContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".json")) {
      setErrorMessage("Por favor, selecione um arquivo JSON válido.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadedFileName(file.name);
    setErrorMessage("");

    try {
      // Simula uma progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Lê o arquivo JSON e valida seus dados
      const text = await file.text();
      let contratosJson = JSON.parse(text);

      const jsonParcelaSchema = z.object({
        valorvencimento: z.number().nonoptional(),
        datavencimento: z.string(),
        dataultimopagamento: z.string().optional().nullable(),
        totalpago: z.number(),
        capitalaberto: z.number(),
      });

      const jsonContratoSchema = z.object({
        contrato: z.string().nonoptional(),
        data: z.string(),
        valortotal: z.number(),
        valorfinanciado: z.number(),
        valorentrada: z.number(),
        parcelas: z.array(jsonParcelaSchema).optional(),
      });

      const jsonContratosSchema = z.object({
        contratos: z.array(jsonContratoSchema),
      });

      try {
        contratosJson = jsonContratosSchema.parse(contratosJson);
      } catch (error) {
        throw new Error(
          "Estrutura JSON de contrato inválida. Verifique se todos os campos obrigatórios estão presentes."
        );
      }

      const data = await postContratos(contratosJson);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.status > 200) {
        setUploadStatus("success");
        // Precisamos resetar ao estado inicial
        setTimeout(resetUpload, 3000);
      } else {
        console.log(data);
        throw new Error(data.statusText);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao processar o arquivo JSON."
      );
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadedFileName("");
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderUpload: { [k in typeof uploadStatus]: React.ReactNode } = {
    idle: (
      <>
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <FaFileUpload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Arraste e solte seu arquivo JSON aqui
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ou clique para selecionar um arquivo
          </p>
        </div>
        <Button variant="secondary" className="mt-4 bg-transparent">
          Selecionar Arquivo
        </Button>
      </>
    ),
    uploading: (
      <>
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <FaFileAlt className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Processando {uploadedFileName}...
          </p>
          <Progress value={uploadProgress} className="mt-2 max-w-xs mx-auto" />
          <p className="text-sm text-muted-foreground mt-1">
            {uploadProgress}% concluído
          </p>
        </div>
      </>
    ),
    success: (
      <>
        <div className="mx-auto w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
          <FaCheckCircle className="h-6 w-6 text-success-dark" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Upload realizado com sucesso!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Os dados dos contratos foram atualizados
          </p>
        </div>
      </>
    ),
    error: (
      <>
        <div className="mx-auto w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center">
          <FaExclamationCircle className="h-6 w-6 text-danger-dark" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">Erro no upload</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tente novamente com um arquivo válido
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={resetUpload}
          className="mt-4 bg-transparent">
          Tentar Novamente
        </Button>
      </>
    ),
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FaFileUpload className="h-5 w-5 text-primary" />
            Upload de Arquivo JSON
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Carregue um arquivo JSON com os dados dos contratos para atualizar o
            sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
              uploadStatus === "uploading" && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">{renderUpload[uploadStatus]}</div>
          </div>

          {/* Alertas */}
          {uploadStatus === "error" && errorMessage && (
            <Alert className="border-danger/30 bg-danger/10">
              <FaExclamationCircle className="h-4 w-4 text-danger-dark" />
              <AlertDescription className="text-danger-dark">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "success" && (
            <Alert className="border-success/30 bg-success/10">
              <FaCheckCircle className="h-4 w-4 text-success-dark" />
              <AlertDescription className="text-success-dark">
                Arquivo processado com sucesso! Os contratos foram atualizados
                automaticamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Formato do Arquivo JSON
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Exemplo da estrutura esperada para o arquivo JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto text-foreground">
            {`{
   "contratos": [
     {
       "parcelas": [
         {
           "valorvencimento": 148.78,
           "datavencimento": "2019-06-22",
           "dataultimopagamento": "2019-06-10",
           "totalpago": 148.78,
           "capitalaberto": 0
         }
       ],
       "contrato": "0480000000000000000001669920190508",
       "data": "2019-05-08",
       "valortotal": 148.78,
       "valorentrada": 0,
       "valorfinanciado": 148.78
     },
   ]
 }`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
