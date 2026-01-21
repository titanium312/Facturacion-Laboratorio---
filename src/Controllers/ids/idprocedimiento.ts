import { Request, Response } from "express";
import axios from "axios";

export const idProcedimiento = async (req: Request, res: Response) => {
  try {
    const { nombreProcedimiento } = req.query;

    if (!nombreProcedimiento) {
      return res.status(400).json({
        message: "El parámetro nombreProcedimiento es obligatorio",
      });
    }

    const response = await axios.get(
      "https://balance.saludplus.co/procedimientos/ProcedimientosBuscarNombre",
      {
        params: {
          nombreProcedimiento,
          capitulos: "",
          _: Date.now(),
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "data":
            "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
        },
      }
    );

    // Filtrar solo los que coincidan exactamente con el código inicial
    const procedimientosFiltrados = response.data
      .filter((p: any) => p.text.startsWith(nombreProcedimiento as string))
      .map((p: any) => ({
        id_procedimiento: p.id,
        IdServicio: p.IdServicio,
      }));

    return res.status(200).json(procedimientosFiltrados);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error consultando procedimientos",
      error: error.message,
    });
  }
};
