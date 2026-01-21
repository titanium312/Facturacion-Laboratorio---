"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historia = void 0;
const axios_1 = __importDefault(require("axios"));
const historia = async (req, res) => {
    try {
        const { idHistoria } = req.query;
        if (!idHistoria) {
            return res.status(400).json({ error: "Debe proporcionar idHistoria" });
        }
        const response = await axios_1.default.get("https://balance.saludplus.co/historiaClinicaUnificada/HIstoriaClinicaBuscar", {
            params: { idHistoria },
            responseType: "json",
        });
        const data = response.data;
        // Recolectar TODOS los procedimientos de cualquier tipo
        const todosProcedimientos = [];
        // 1. Procedimientos diagnósticos
        if (data.historia_clinica_procedimientos_diagnosticos) {
            data.historia_clinica_procedimientos_diagnosticos.forEach((proc) => {
                todosProcedimientos.push({
                    tipo: "diagnóstico",
                    codigo: proc.fk_procedimiento,
                    cantidad: proc.cantidad,
                    grupo: proc.grupo
                });
            });
        }
        // 2. Procedimientos terapéuticos
        if (data.historia_clinica_procedimientos_terapeuticos) {
            data.historia_clinica_procedimientos_terapeuticos.forEach((proc) => {
                todosProcedimientos.push({
                    tipo: "terapéutico",
                    codigo: proc.fk_procedimiento,
                    cantidad: proc.cantidad,
                });
            });
        }
        // 3. Procedimientos odontológicos
        if (data.historia_clinica_procedimientos_odontologicos) {
            data.historia_clinica_procedimientos_odontologicos.forEach((proc) => {
                todosProcedimientos.push({
                    tipo: "odontológico",
                    codigo: proc.fk_procedimiento,
                    cantidad: proc.cantidad
                });
            });
        }
        // 4. Procedimiento principal (si existe)
        if (data.fk_procedimiento) {
            todosProcedimientos.push({
                tipo: "principal",
                codigo: data.fk_procedimiento
            });
        }
        // 5. Procedimiento SOAT (si existe)
        if (data.fk_procedimiento_soat) {
            todosProcedimientos.push({
                tipo: "SOAT",
                codigo: data.fk_procedimiento_soat
            });
        }
        // Respuesta filtrada con SOLO los campos solicitados
        const historiaFiltrada = {
            fk_entidad: data.facturacion_admisiones?.fk_entidad,
            fk_paciente: data.facturacion_admisiones?.fk_paciente,
            fk_contrato_entidad: data.facturacion_admisiones?.fk_contrato_entidad,
            fk_usuario: data.facturacion_admisiones?.fk_usuario,
            fk_admision: data.fk_admision,
            numero_admision: data.facturacion_admisiones?.numero_admision,
            fecha_admision: data.facturacion_admisiones?.fecha_admision,
            // Todos los procedimientos en un solo array
            todos_procedimientos: todosProcedimientos,
            // Conteo por tipo
            conteo_procedimientos: {
                diagnosticos: data.historia_clinica_procedimientos_diagnosticos?.length || 0,
                terapeuticos: data.historia_clinica_procedimientos_terapeuticos?.length || 0,
                odontologicos: data.historia_clinica_procedimientos_odontologicos?.length || 0,
                principal: data.fk_procedimiento ? 1 : 0,
                soat: data.fk_procedimiento_soat ? 1 : 0,
                total: todosProcedimientos.length
            }
        };
        res.json({
            success: true,
            data: historiaFiltrada,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Error al obtener historia clínica:", error.message);
        res.status(500).json({
            error: "Error al obtener la historia clínica"
        });
    }
};
exports.historia = historia;
