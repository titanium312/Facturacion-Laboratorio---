"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listaPreciosProcedimiento = void 0;
const axios_1 = __importDefault(require("axios"));
// Mapeo de idProcedimiento -> idProcedimientoSoat para casos especiales
// Agrega más entradas según necesites
const MAPPING_SOAT = {
    "9737": "19140",
    "9602": "19087",
};
const listaPreciosProcedimiento = async (req, res) => {
    try {
        const { idContrato, idProcedimiento } = req.query;
        if (!idContrato || !idProcedimiento) {
            return res.status(400).json({
                message: "Los parámetros idContrato e idProcedimiento son obligatorios",
            });
        }
        const idProcStr = String(idProcedimiento);
        const idContratoStr = String(idContrato);
        // Caso especial: idProcedimiento está en el mapeo
        if (MAPPING_SOAT[idProcStr]) {
            const idProcedimientoSoat = MAPPING_SOAT[idProcStr];
            const response = await axios_1.default.get("https://balance.saludplus.co/Listasprecios/CalcularValorSoat", {
                params: {
                    idContrato: idContratoStr,
                    idProcedimientoSoat,
                    idProcedimiento: idProcStr,
                },
                headers: {
                    // Solo el token, tal como en el curl
                    "data": "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
                },
            });
            // Extraemos solo el valorTotal (puedes ajustar si necesitas más campos)
            const valorTotal = response.data?.valorTotal ?? 0;
            return res.status(200).json({ valorTotal });
        }
        // Comportamiento original para el resto de procedimientos
        const response = await axios_1.default.get("https://balance.saludplus.co/Listasprecios/ListasPreciosBuscarProcedimientos", {
            params: {
                idContrato: idContratoStr,
                idProcedimiento: idProcStr,
            },
            headers: {
                // También solo el token
                "data": "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
            },
        });
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
