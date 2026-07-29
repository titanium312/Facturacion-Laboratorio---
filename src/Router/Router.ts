import { Router, Request, Response } from "express";
import { jsoncompleto } from "../Controllers/ids/1-jsoncompleto";
import { historia } from "../Controllers/ids/3-Historia";
import { listaProcedimientos } from "../Controllers/ids/arrays/3.5-listaPRocedimiento"; // ✅ Nombre correcto: listaProcedimientos
import { ListaEntidadesEps } from "../Controllers/ids/arrays/ListaEntidadesEps";
import { contratosValidos } from "../Controllers/ids/4-Contrato";
import { listaPreciosProcedimiento } from "../Controllers/ids/valorProcedimiento";
import { buscarPaciente } from "../Controllers/ids/2-BuscarPacienteFactura";
import { BuscarPacienteAdmicion } from "../Controllers/ids/BuscarPacienteAdmicion";
import { BuscarProdecidento } from "../Controllers/ids/idprocedimiento";
import { buscarFacturaSelectUsuarios } from "../Controllers/ids/Profecional";
import { enviarAdmisionesFacturas } from "../Controllers/Subirfactura";

const router = Router();

// Rutas GET
router.get("/jsoncompleto", jsoncompleto);
router.get("/buscarPaciente", buscarPaciente);
router.get("/BuscarPacienteAdmicion", BuscarPacienteAdmicion);
router.get("/historia", historia);
router.get("/extrearProcedimiento", listaProcedimientos); // ✅ Nombre corregido
router.get("/ListaEntidadesEps", ListaEntidadesEps);
router.get("/BuscarProdecidento", BuscarProdecidento);
router.get("/contratos-validos", contratosValidos);
router.get("/valorPRocedimiento", listaPreciosProcedimiento);

// Rutas POST
router.post("/profecional", buscarFacturaSelectUsuarios);
router.post("/subir", enviarAdmisionesFacturas);

// Ruta de prueba
router.get("/test", (req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;