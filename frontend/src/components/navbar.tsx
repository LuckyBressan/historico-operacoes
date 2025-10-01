import { Button } from "./ui/button";
import { NavLink, useLocation } from "react-router";
import { FaFileAlt, FaFileUpload } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import type { IconType } from "react-icons";

export default function Navbar() {
    const location = useLocation()

    const path = location.pathname.replace('/', '')

    let headerPagina : {
      titulo: string;
      icone : IconType
    } = {
      titulo: '',
      icone : FaFileAlt
    }

    switch (path) {
        case 'contratos':
          headerPagina.titulo = 'Consulta de Contratos'
          break;
        case 'upload':
            headerPagina = {
              titulo: 'Upload de Contratos',
              icone : FaFileUpload
            }
            break;
        case 'calcular':
            headerPagina = {
              titulo: 'Ánalise Maior Valor em Aberto',
              icone : FaHandHoldingDollar
            }
            break;
        default:
            break;
    }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto p-2 sm:px-6 sm:py-4">
        <div className="flex items-center justify-center md:justify-between">
          <div className="items-center gap-3 hidden md:flex">
            <headerPagina.icone className="h-6 w-6 text-primary" />
            <h1>
              { headerPagina.titulo }
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/contratos" end>
              <Button
                variant={path === "contratos" ? "default" : "ghost"}
                className="gap-2">
                <FaFileAlt className="h-4 w-4" />
                Contratos
              </Button>
            </NavLink>
            <NavLink to="/upload" end>
              <Button
                variant={path === "upload" ? "default" : "ghost"}
                className="gap-2">
                <FaFileUpload className="h-4 w-4" />
                Upload
              </Button>
            </NavLink>
            <NavLink to="/calcular" end>
              <Button
                variant={path === "calcular" ? "default" : "ghost"}
                className="gap-2">
                <FaHandHoldingDollar className="h-4 w-4" />
                Análise
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
