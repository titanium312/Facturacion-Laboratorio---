// controllers/buscarFacturaSelectUsuarios.ts
import { Request, Response } from "express";
import axios from "axios";

export const buscarFacturaSelectUsuarios = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.idContrato) {
      return res.status(400).json({ 
        ok: false,
        message: "El parámetro idContrato es obligatorio" 
      });
    }

    const response = await axios.post(
      "https://balance.saludplus.co/facturas/BucardorfacturasProcedimientos",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          data: "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw=="
        }
      }
    );

    const html = response.data as string;

    const selectRegex =
      /<select[^>]*id="cbo_usuarios_procedimientos_[^"]*"[^>]*>([\s\S]*?)<\/select>/i;

    const match = html.match(selectRegex);

    if (!match) {
      return res.status(404).json({ 
        ok: false,
        message: "No se encontró el select de usuarios" 
      });
    }

    const selectInnerHtml = match[1];

    const optionRegex = /<option\s+value="([^"]*)">([^<]*)<\/option>/g;

    const users: { id: string; nombre: string }[] = [];
    let optionMatch;

    while ((optionMatch = optionRegex.exec(selectInnerHtml)) !== null) {
      let id = optionMatch[1].replace(/['"\+]/g, "").trim();
      let nombre = optionMatch[2].replace(/['"\+]/g, "").trim();

      if (id && nombre) {
        users.push({ id, nombre });
      }
    }

    users.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return res.status(200).json({
      ok: true,
      total: users.length,
      users
    });

  } catch (error: any) {
    console.error("ERROR profesional:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo usuarios",
      error: error.message
    });
  }
};
