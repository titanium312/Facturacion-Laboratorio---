"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuscarPacienteAdmicion = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const BuscarPacienteAdmicion = async (req, res) => {
    try {
        const { documentoPaciente } = req.query;
        if (!documentoPaciente) {
            return res.status(400).json({
                message: "documentoPaciente es obligatorio"
            });
        }
        const response = await axios_1.default.get("https://balance.saludplus.co/pacientes/PacientesBuscar", {
            params: {
                idPaciente: 0,
                documentoPaciente,
                nombrePaciente: "*"
            },
            headers: {
                // 🔴 Usa tu token real aquí
                data: "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw=="
            },
            httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false })
        });
        if (!Array.isArray(response.data) || response.data.length === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        const paciente = response.data[0];
        const resultado = {
            id_paciente: paciente.id_paciente,
            fk_entidad: paciente.fk_entidad,
            fk_institucion: paciente.fk_institucion,
            documento_paciente: paciente.documento_paciente,
            tipo_documento_Paciente: paciente.tipo_documento_Paciente,
            nombre1_paciente: paciente.nombre1_paciente,
            nombre2_paciente: paciente.nombre2_paciente,
            apellido1_paciente: paciente.apellido1_paciente,
            apellido2_paciente: paciente.apellido2_paciente,
            fecha_nacimiento: paciente.fecha_nacimiento
        };
        res.json(resultado);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Error consultando paciente",
            error: error.response?.status
        });
    }
};
exports.BuscarPacienteAdmicion = BuscarPacienteAdmicion;
