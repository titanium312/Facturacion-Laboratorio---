"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idProcedimiento = void 0;
const axios_1 = __importDefault(require("axios"));
const idProcedimiento = async (req, res) => {
    try {
        const { nombreProcedimiento } = req.query;
        if (!nombreProcedimiento) {
            return res.status(400).json({
                message: "El parámetro nombreProcedimiento es obligatorio",
            });
        }
        const response = await axios_1.default.get("https://balance.saludplus.co/procedimientos/ProcedimientosBuscarNombre", {
            params: {
                nombreProcedimiento,
                capitulos: "",
                _: Date.now(),
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "data": "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
            },
        });
        // Filtrar solo los que coincidan exactamente con el código inicial
        const procedimientosFiltrados = response.data
            .filter((p) => p.text.startsWith(nombreProcedimiento))
            .map((p) => ({
            id_procedimiento: p.id,
            IdServicio: p.IdServicio,
        }));
        return res.status(200).json(procedimientosFiltrados);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error consultando procedimientos",
            error: error.message,
        });
    }
};
exports.idProcedimiento = idProcedimiento;
