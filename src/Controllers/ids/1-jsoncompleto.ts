import { Request, Response } from "express";
import { buscarPacienteData } from "./2-BuscarPacienteFactura";
import { historia } from "./3-Historia";
import { procedimientosDB } from "./3.5-listaPRocedimiento"; 

export const jsoncompleto = async (req: Request, res: Response) => {
  try {
    const { numeroDocumento } = req.query;
    if (!numeroDocumento || typeof numeroDocumento !== "string") {
      return res.status(400).json({ ok: false, message: "Debe enviar numeroDocumento" });
    }

    const pacientes = await buscarPacienteData(numeroDocumento);

    const historiasCompletas = await Promise.all(
      pacientes.map(async (paciente) => {
        const fakeReq: any = { query: { idHistoria: paciente.idHistoria } };
        
        const historiaData: any = await new Promise((resolve, reject) => {
          const fakeRes: any = {
            json: (data: any) => resolve(data.data || data),
            status: (code: number) => fakeRes,
          };
          historia(fakeReq, fakeRes).catch(reject);
        });

        // 🟢 PROCESAMIENTO DEL ARRAY DE PROCEDIMIENTOS
        if (historiaData.todos_procedimientos && Array.isArray(historiaData.todos_procedimientos)) {
          historiaData.todos_procedimientos = historiaData.todos_procedimientos.map((proc: any) => {
            
            // Buscamos en la DB usando el campo "codigo" que viene en tu JSON
            // Lo convertimos a número para comparar con el ID de la lista
            const infoExtra = procedimientosDB.find(p => p.id === parseInt(proc.codigo));

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
      })
    );

    return res.json({
      ok: true,
      numeroDocumento,
      fechaConsulta: new Date().toISOString(),
      resultadoCompleto: historiasCompletas,
    });

  } catch (e: any) {
    console.error("❌ jsoncompleto:", e);
    return res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
};