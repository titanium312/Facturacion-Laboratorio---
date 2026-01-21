"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { enviarAdmisionesFacturas } = require("../Controllers/Subirfactura");
const { jsoncompleto } = require("../Controllers/ids/1-jsoncompleto");
const { historia } = require("../Controllers/ids/3-Historia");
const { listaPRocedimiento } = require("../Controllers/ids/3.5-listaPRocedimiento");
const { contratosValidos } = require("../Controllers/ids/4-Contrato");
const { listaPreciosProcedimiento } = require("../Controllers/ids/valorProcedimiento");
const { buscarPaciente } = require("../Controllers/ids/2-BuscarPacienteFactura");
const { idProcedimiento } = require("../Controllers/ids/idprocedimiento");
const { buscarFacturaSelectUsuarios } = require("../Controllers/ids/Profecional");
const router = (0, express_1.Router)();
// Ruta simple
router.get("/jsoncompleto", jsoncompleto);
router.get("/buscarPaciente", buscarPaciente);
router.get("/historia", historia);
router.get("/extrearProcedimiento", listaPRocedimiento);
router.get("/contratos-validos", contratosValidos);
router.get("/idprocedimiento", idProcedimiento);
router.get("/valorPRocedimiento", listaPreciosProcedimiento);
router.post("/profecional", buscarFacturaSelectUsuarios);
// Subir Factura
router.post("/subir", enviarAdmisionesFacturas);
exports.default = router;
