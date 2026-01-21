"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contratosValidos = void 0;
const axios_1 = __importDefault(require("axios"));
const contratosValidos = async (req, res) => {
    try {
        const { fechaEmision, idContrato, idEntidad, validarSede } = req.query;
        if (!fechaEmision || !idEntidad) {
            return res.status(400).json({
                message: "Los parámetros fechaEmision y idEntidad son obligatorios",
            });
        }
        const response = await axios_1.default.get("https://balance.saludplus.co/facturas/BuscarContratosValidos", {
            params: {
                fechaEmision,
                idContrato: idContrato || 0,
                idEntidad,
                validarSede: validarSede || true,
            },
            headers: {
                "data": "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
            },
        });
        // Filtramos todos los contratos
        const contratos = response.data.map((c) => ({
            id_contrato_entidad: c.id_contrato_entidad,
            descripcion_contrato: c.descripcion_contrato ? c.descripcion_contrato.trim() : "",
        }));
        return res.status(200).json(contratos);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error consultando contratos válidos",
            error: error.message,
        });
    }
};
exports.contratosValidos = contratosValidos;
