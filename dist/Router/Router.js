"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { enviarAdmisionesFacturas } = require("../Controllers/Subirfactura");
const { jsoncompleto } = require("../Controllers/ids/1-jsoncompleto");
const { historia } = require("../Controllers/ids/3-Historia");
const { listaPRocedimiento } = require("../Controllers/ids/arrays/3.5-listaPRocedimiento");
const { ListaEntidadesEps } = require("../Controllers/ids/arrays/ListaEntidadesEps");
const { contratosValidos } = require("../Controllers/ids/4-Contrato");
const { listaPreciosProcedimiento } = require("../Controllers/ids/valorProcedimiento");
const { buscarPaciente } = require("../Controllers/ids/2-BuscarPacienteFactura");
const { BuscarPacienteAdmicion } = require("../Controllers/ids/BuscarPacienteAdmicion");
const { BuscarProdecidento } = require("../Controllers/ids/idprocedimiento");
const { buscarFacturaSelectUsuarios } = require("../Controllers/ids/Profecional");
const router = (0, express_1.Router)();
// Ruta simple
router.get("/jsoncompleto", jsoncompleto);
router.get("/buscarPaciente", buscarPaciente);
router.get("/BuscarPacienteAdmicion", BuscarPacienteAdmicion);
router.get("/historia", historia);
router.get("/extrearProcedimiento", listaPRocedimiento);
router.get("/ListaEntidadesEps", ListaEntidadesEps);
router.get("/BuscarProdecidento", BuscarProdecidento);
router.get("/contratos-validos", contratosValidos);
router.get("/valorPRocedimiento", listaPreciosProcedimiento);
router.post("/profecional", buscarFacturaSelectUsuarios);
// Subir Factura
router.post("/subir", enviarAdmisionesFacturas);
router.get("/test", (req, res) => {
    res.json({ ok: true });
});
exports.default = router;
