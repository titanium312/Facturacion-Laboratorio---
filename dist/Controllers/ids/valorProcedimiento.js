"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listaPreciosProcedimiento = void 0;
const axios_1 = __importDefault(require("axios"));
const listaPreciosProcedimiento = async (req, res) => {
    try {
        const { idContrato, idProcedimiento } = req.query;
        if (!idContrato || !idProcedimiento) {
            return res.status(400).json({
                message: "Los parámetros idContrato e idProcedimiento son obligatorios",
            });
        }
        const response = await axios_1.default.get("https://balance.saludplus.co/Listasprecios/ListasPreciosBuscarProcedimientos", {
            params: {
                idContrato,
                idProcedimiento,
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "data": "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
            },
        });
        // Retorna la respuesta tal cual la devuelve la API
        return res.status(200).json(response.data);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error consultando lista de precios del procedimiento",
            error: error.message,
        });
    }
};
exports.listaPreciosProcedimiento = listaPreciosProcedimiento;
