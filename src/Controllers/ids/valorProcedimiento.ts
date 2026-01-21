import { Request, Response } from "express";
import axios from "axios";

export const listaPreciosProcedimiento = async (req: Request, res: Response) => {
  try {
    const { idContrato, idProcedimiento } = req.query;

    if (!idContrato || !idProcedimiento) {
      return res.status(400).json({
        message: "Los parámetros idContrato e idProcedimiento son obligatorios",
      });
    }

    const response = await axios.get(
      "https://balance.saludplus.co/Listasprecios/ListasPreciosBuscarProcedimientos",
      {
        params: {
          idContrato,
          idProcedimiento,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "data":
            "AQSl6hWJhjPIqRE5FVxQEj2m+tBylqGIYr3XszOGeF8=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==",
        },
      }
    );

    // Retorna la respuesta tal cual la devuelve la API
    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error consultando lista de precios del procedimiento",
      error: error.message,
    });
  }
};
