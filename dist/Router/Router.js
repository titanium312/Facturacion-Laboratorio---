"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _1_jsoncompleto_1 = require("../Controllers/ids/1-jsoncompleto");
const _3_Historia_1 = require("../Controllers/ids/3-Historia");
const _3_5_listaPRocedimiento_1 = require("../Controllers/ids/arrays/3.5-listaPRocedimiento"); // ✅ Nombre correcto: listaProcedimientos
const ListaEntidadesEps_1 = require("../Controllers/ids/arrays/ListaEntidadesEps");
const _4_Contrato_1 = require("../Controllers/ids/4-Contrato");
const valorProcedimiento_1 = require("../Controllers/ids/valorProcedimiento");
const _2_BuscarPacienteFactura_1 = require("../Controllers/ids/2-BuscarPacienteFactura");
const BuscarPacienteAdmicion_1 = require("../Controllers/ids/BuscarPacienteAdmicion");
const idprocedimiento_1 = require("../Controllers/ids/idprocedimiento");
const Profecional_1 = require("../Controllers/ids/Profecional");
const Subirfactura_1 = require("../Controllers/Subirfactura");
const router = (0, express_1.Router)();
// Rutas GET
router.get("/jsoncompleto", _1_jsoncompleto_1.jsoncompleto);
router.get("/buscarPaciente", _2_BuscarPacienteFactura_1.buscarPaciente);
router.get("/BuscarPacienteAdmicion", BuscarPacienteAdmicion_1.BuscarPacienteAdmicion);
router.get("/historia", _3_Historia_1.historia);
router.get("/extrearProcedimiento", _3_5_listaPRocedimiento_1.listaProcedimientos); // ✅ Nombre corregido
router.get("/ListaEntidadesEps", ListaEntidadesEps_1.ListaEntidadesEps);
router.get("/BuscarProdecidento", idprocedimiento_1.BuscarProdecidento);
router.get("/contratos-validos", _4_Contrato_1.contratosValidos);
router.get("/valorPRocedimiento", valorProcedimiento_1.listaPreciosProcedimiento);
// Rutas POST
router.post("/profecional", Profecional_1.buscarFacturaSelectUsuarios);
router.post("/subir", Subirfactura_1.enviarAdmisionesFacturas);
// Ruta de prueba
router.get("/test", (req, res) => {
    res.json({ ok: true });
});
exports.default = router;
