"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarProdecidento = void 0;
const axios_1 = __importDefault(require("axios"));
const BuscarProdecidento = async (req, res) => {
    try {
        const { id_historia_clinica } = req.query;
        if (!id_historia_clinica) {
            return res.status(400).json({ message: "id_historia_clinica requerido" });
        }
        const url = "https://balance.saludplus.co/historiaClinicaUnificada/BucardorHistoriaProcedimientosDiagnosticosDetalle";
        const response = await axios_1.default.post(url, {
            accion: "TRAE",
            id_historia_clinica: Number(id_historia_clinica),
        }, {
            headers: {
                "Content-Type": "application/json",
                data: "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
            },
            responseType: "text",
        });
        const html = response.data;
        // 🔎 REGEX PARA EXTRAER CUP + NOMBRE
        // ejemplo: '903895 - GLUCOSA EN SUERO'
        const regex = /(\d{6})\s*-\s*([^<\r\n]+)/g;
        const procedimientos = [];
        const vistos = new Set();
        let match;
        while ((match = regex.exec(html)) !== null) {
            const cup = match[1];
            const nombre = match[2].trim();
            const key = cup + nombre;
            if (!vistos.has(key)) {
                vistos.add(key);
                procedimientos.push({ cup, nombre });
            }
        }
        return res.json({
            total: procedimientos.length,
            procedimientos,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error procesando procedimientos",
            error: error.message,
        });
    }
};
exports.BuscarProdecidento = BuscarProdecidento;
