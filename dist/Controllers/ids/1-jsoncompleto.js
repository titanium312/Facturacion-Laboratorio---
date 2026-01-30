"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsoncompleto = void 0;
const _2_BuscarPacienteFactura_1 = require("./2-BuscarPacienteFactura");
const _3_Historia_1 = require("./3-Historia");
const _3_5_listaPRocedimiento_1 = require("./arrays/3.5-listaPRocedimiento");
const jsoncompleto = async (req, res) => {
    try {
        const { numeroDocumento } = req.query;
        if (!numeroDocumento || typeof numeroDocumento !== "string") {
            return res.status(400).json({ ok: false, message: "Debe enviar numeroDocumento" });
        }
        const pacientes = await (0, _2_BuscarPacienteFactura_1.buscarPacienteData)(numeroDocumento);
        const historiasCompletas = await Promise.all(pacientes.map(async (paciente) => {
            const fakeReq = { query: { idHistoria: paciente.idHistoria } };
            const historiaData = await new Promise((resolve, reject) => {
                const fakeRes = {
                    json: (data) => resolve(data.data || data),
                    status: (code) => fakeRes,
                };
                (0, _3_Historia_1.historia)(fakeReq, fakeRes).catch(reject);
            });
            // 🟢 PROCESAMIENTO DEL ARRAY DE PROCEDIMIENTOS
            if (historiaData.todos_procedimientos && Array.isArray(historiaData.todos_procedimientos)) {
                historiaData.todos_procedimientos = historiaData.todos_procedimientos.map((proc) => {
                    // Buscamos en la DB usando el campo "codigo" que viene en tu JSON
                    // Lo convertimos a número para comparar con el ID de la lista
                    const infoExtra = _3_5_listaPRocedimiento_1.procedimientosDB.find(p => p.id === parseInt(proc.codigo));
                    return {
                        ...proc,
                        fk_procedimiento: proc.codigo, // Renombramos 'codigo' a 'fk_procedimiento'
                        cup: infoExtra ? infoExtra.cups : "N/A",
                        nombreProcedimiento: infoExtra ? infoExtra.nombre : "Procedimiento no encontrado"
                    };
                });
            }
            return {
                paciente,
                historia: historiaData
            };
        }));
        return res.json({
            ok: true,
            numeroDocumento,
            fechaConsulta: new Date().toISOString(),
            resultadoCompleto: historiasCompletas,
        });
    }
    catch (e) {
        console.error("❌ jsoncompleto:", e);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
};
exports.jsoncompleto = jsoncompleto;
