import { Request, Response } from "express";
import axios from "axios";
import https from "https";
import { token as tokens } from "./ids/token"; // 🔹 Importamos el array de tokens

/**
 * Convierte fecha de DD/MM/YYYY a MM/DD/YYYY
 */
function convertirFecha(fecha: string): string {
    const [dd, mm, yyyy] = fecha.split("/");
    return `${mm}/${dd}/${yyyy}`;
}

interface Procedimiento {
    fk_procedimiento: string;
    valor_unitario: number;
    fk_usuario: string;
    IdServicio: string;
}

export const enviarAdmisionesFacturas = async (req: Request, res: Response) => {
    try {
        const { fk_entidad, fk_paciente, fk_contrato_entidad, fecha_admision, fecha_remision, fecha_emision, procedimientos, FacturadorId } = req.body;

        if (!fk_entidad || !fk_paciente || !fk_contrato_entidad || !fecha_admision || !fecha_remision || !fecha_emision || !FacturadorId) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
        }

        // 🔹 Buscamos el token correspondiente al FacturadorId
        const tokenObj = tokens.find(t => t.FacturadorId === FacturadorId);
        if (!tokenObj) {
            return res.status(400).json({ success: false, message: "Token no encontrado para el FacturadorId proporcionado" });
        }

        const fechaAdmision = convertirFecha(fecha_admision);
        const fechaRemision = convertirFecha(fecha_remision);
        const fechaEmision = convertirFecha(fecha_emision);
        const hora = new Date().toTimeString().split(' ')[0];

        const payload: any = {
            Admision: {
                fecha_admision: fechaAdmision,
                hora_admision: hora,
                fecha_remision: fechaRemision,
                hora_remision: hora,
                fecha_emision: fechaEmision,
                hora_emision: hora,
                fk_entidad,
                fk_paciente,
                fk_contrato_entidad,
                metodo_pago: "2",
                fk_recurso: "3",
            },
            FacturasCompletasPasar: {
                FacturasF: [
                    {
                        fecha_emision: fechaEmision,
                        hora_emision: hora,
                        fk_paciente,
                        fk_entidad,
                        fk_contrato_entidad,
                    }
                ],
                FacturasProcedimientosF: procedimientos?.map((p: Procedimiento) => ({
                    fk_procedimiento: p.fk_procedimiento,
                    fecha_procedimiento: fechaEmision,
                    hora_procedimiento: hora,
                    cantidad: 1,
                    fk_recurso: "3",
                    fk_centro_costos: "515",
                    fk_centro_servicios: "740",
                    fk_finalidad_procedimiento: "12",
                    fk_enfermedad_diagnostico_principal: "Z000",
                    valor_unitario: p.valor_unitario,
                    valor_total: p.valor_unitario, // cantidad = 1
                    facturar: true,
                    fk_usuario: p.fk_usuario,
                    IdModalidadAtencion: 1,
                    IdViaIngreso: 1,
                    IdServicio: p.IdServicio
                })) || []
            }
        };

        const response = await axios.post(
            "https://balance.saludplus.co/admisiones/AdmisionesFacturasEditar",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "data": tokenObj.token // 🔹 Usamos el token dinámico
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            }
        );

        res.json({ success: true, data: response.data });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message, error: error.response?.data });
    }
};
