import { Request, Response } from "express";

export const ListaEntidadesEps = async (req: Request, res: Response) => {
  try {
    const ListaEntidadesEps = [
      { id: 4353, nombre: "PARTICULAR" },
      { id: 4354, nombre: "NUEVA EPS - SUBSIDIADO" },
      { id: 4357, nombre: "MUTUALSER - CONTRIBUTIVO" },
      { id: 4356, nombre: "COOSALUD EPS - SUBSIDIADO" },
      { id: 4363, nombre: "MUTUAL SER - SUBSIDIADO" },
      { id: 4355, nombre: "CAJACOPI EPS S.A.S - SUBSIDIADO" },
      { id: 4399, nombre: "NUEVA EPS - CONTRIBUTIVO" },
      
      { id: 4358, nombre: "EPS SURAMERICANA S.A - SUBSIDIADO" },
      { id: 4360, nombre: "LA PREVISORA S.A. SOAT" },
      { id: 4362, nombre: "EPS FAMILIAR DE COLOMBIA - SUBSIDIADO" },
      
      { id: 4365, nombre: "ADRES" },
      { id: 4366, nombre: "SURAMERICANA DE SEGUROS S.A" },
      { id: 4367, nombre: "SEGUROS DEL ESTADO S.A" },
      { id: 4368, nombre: "SEGUROS BOLIVAR S.A" },
      { id: 4370, nombre: "SAVIA SALUD EPS - SUBSIDIADO" },
      { id: 4378, nombre: "EPS FAMISANAR - SUBSIDIADO" },
      { id: 4384, nombre: "CAPITAL SALUD - SUBSIDIADO" },
      { id: 4388, nombre: "SALUD TOTAL EPS - SUBSIDIADO" },
      { id: 4390, nombre: "SANITAS EPS - SUBSIDIADO" },
      
      { id: 4400, nombre: "CAJACOPI EPS - CONTRIBUTIVO" },
      { id: 4404, nombre: "COMPENSAR EPS - CONTRIBUTIVO" },
      { id: 4409, nombre: "SALUD TOTAL EPS - CONTRIBUTIVO" },
      { id: 4410, nombre: "SANITAS EPS - CONTRIBUTIVO" },
      { id: 4441, nombre: "ALIANSALUD EPS - CONTRIBUTIVO" },
      { id: 4457, nombre: "ALIANSALUD EPS - SUBSIDIADO" },
      { id: 4476, nombre: "ASMET SALUD - SUBSIDIADO" },
      { id: 4477, nombre: "ASMET SALUD - CONTRIBUTIVO" },
      { id: 4560, nombre: "ECOPETROL S.A" },
      { id: 4564, nombre: "COLMÉDICA MEDICINA PREPAGADA" },
      { id: 4582, nombre: "EMSSANAR EPS - CONTRIBUTIVO" },
      { id: 4810, nombre: "EMSSANAR EPS - SUBSIDIADO" }
    ];

    return res.status(200).json(ListaEntidadesEps);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la lista de EPS",
    });
  }
};
