import { Request, Response } from "express";

// 🔹 Exportamos el array para que otros archivos lo usen
export const procedimientosDB = [
  { id: 8704, cups: "901101", nombre: "COLORACION ACIDO ALCOHOL RESISTENTE [ZIELH-NIELSEN] Y LECTURA O BACILOSCOPIA" },
  { id: 8750, cups: "901235", nombre: "UROCULTIVO [ANTIBIOGRAMA DE DISCO]" },
  { id: 8762, cups: "901304", nombre: "EXAMEN DIRECTO FRESCO DE CUALQUIER MUESTRA" },
  { id: 8763, cups: "901305", nombre: "EXAMEN DIRECTO PARA HONGOS [KOH]" },
  { id: 8891, cups: "902204", nombre: "ERITROSEDIMENTACION [VELOCIDAD SEDIMENTACION GLOBULAR - VSG]" },
  { id: 8893, cups: "902206", nombre: "EXTENDIDO DE SANGRE PERIFERICA, ESTUDIO DE MORFOLOGIA" },
  { id: 8895, cups: "902207", nombre: "HEMOGRAMA I1" },
  { id: 8895, cups: "902208", nombre: "HEMOGRAMA II2" },
  { id: 8895, cups: "902209", nombre: "HEMOGRAMA III3" },
  { id: 8895, cups: "902210", nombre: "HEMOGRAMA IV4" },
  { id: 8898, cups: "902211", nombre: "HEMATOCRITO" },
  { id: 8900, cups: "902213", nombre: "HEMOGLOBINA" },
  { id: 8901, cups: "902214", nombre: "HEMOPARASITOS, EXTENDIDO DE GOTA GRUESA" },
  { id: 8907, cups: "902220", nombre: "RECUENTO DE PLAQUETAS, MÉTODO AUTOMÁTICO" },
  { id: 8908, cups: "902221", nombre: "RECUENTO DE PLAQUETAS, MÉTODO MANUAL" },
  { id: 9079, cups: "903801", nombre: "ACIDO URICO" },
  { id: 9087, cups: "903809", nombre: "BILIRRUBINAS TOTAL Y DIRECTA" },
  { id: 9091, cups: "903813", nombre: "CLORO [CLORURO]" },
  { id: 9093, cups: "903815", nombre: "COLESTEROL DE ALTA DENSIDAD [HDL]" },
  { id: 9094, cups: "903816", nombre: "COLESTEROL DE BAJA DENSIDAD [LDL] ENZIMATICO" },
  { id: 9096, cups: "903818", nombre: "COLESTEROL TOTAL" },
  { id: 9119, cups: "903841", nombre: "GLUCOSA EN SUERO, LCR U OTRO FLUIDO DIFERENTE A ORINA" },
  { id: 11803, cups: "903841", nombre: "GLUCOSA EN SUERO U OTRO FLUIDO DIFERENTE A ORINA" },
  { id: 9120, cups: "903842", nombre: "GLUCOSA PRE Y POST CARGA DE GLUCOSA" },
  { id: 9121, cups: "903843", nombre: "GLUCOSA PRE Y POST PRANDIAL" },
  { id: 9122, cups: "903844", nombre: "GLUCOSA, CURVA DE TOLERANCIA" },
  { id: 9123, cups: "903845", nombre: "GLUCOSA, TEST O’ SULLIVAN" },
  { id: 9134, cups: "903856", nombre: "NITROGENO UREICO [BUN]" },
  { id: 9146, cups: "903868", nombre: "TRIGLICÉRIDOS" },
  { id: 9147, cups: "903869", nombre: "UREA" },
  { id: 9173, cups: "903895", nombre: "CREATININA EN SUERO U OTROS FLUIDOS" },
  { id: 9218, cups: "904508", nombre: "GONADOTROPINA CORIÓNICA, SUBUNIDAD BETA CUALITATIVA, [BHCG] PRUEBA DE EMBARAZO EN ORINA O SUERO" },
  { id: 9463, cups: "906039", nombre: "TREPONEMA PALLIDUM ANTICUERPOS (PRUEBA TREPONEMICA) MANUAL O SEMIAUTOMATIZADA O AUTOMATIZADA" },
  { id: 9525, cups: "906208", nombre: "Dengue, ANTICUERPOS Ig M" },
  { id: 9542, cups: "906225", nombre: "Hepatitis C, ANTICUERPO [ANTI-HVC] & *+" },
  { id: 9566, cups: "906249", nombre: "VIH 1 Y 2, ANTICUERPOS" },
  { id: 9602, cups: "906317", nombre: "Hepatitis B ANTÍGENO DE SUPERFICIE [Ag HBs]" },
  { id: 9737, cups: "906610", nombre: "ANTÍGENO ESPECÍFICO DE PRÓSTATA SEMIAUTOMATIZADO O AUTOMATIZADO" },
  { id: 9894, cups: "906915", nombre: "PRUEBA NO TREPONEMICA MANUAL" },
  { id: 9898, cups: "907002", nombre: "COPROLÓGICO" },
  { id: 9904, cups: "907008", nombre: "SANGRE OCULTA EN MATERIA FECAL [GUAYACO O EQUIVALENTE] +" },
  { id: 9918, cups: "907106", nombre: "UROANALISIS CON SEDIMENTO Y DENSIDAD URINARIA" },
  { id: 10126, cups: "911015", nombre: "HEMOCLASIFICACION FACTOR Rh [FACTOR D] POR MICROTECNICA" },
  { id: 10128, cups: "911017", nombre: "HEMOCLASIFICACION GRUPO ABO, DIRECTA O GLOBULAR POR MICROTÉCNICA" }
];

export const listaProcedimientos = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: procedimientosDB,
      total: procedimientosDB.length
    });
  } catch (error) {
    console.error('Error al obtener lista de procedimientos:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error al obtener la lista de procedimientos" 
    });
  }
};

// 🔹 Función para buscar procedimientos por ID o CUPS
export const buscarProcedimiento = async (req: Request, res: Response) => {
  try {
    const { termino } = req.params;
    
    if (!termino) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un término de búsqueda"
      });
    }

    const resultados = procedimientosDB.filter(item => 
      item.id.toString().includes(termino) || 
      item.cups.includes(termino) ||
      item.nombre.toLowerCase().includes(termino.toLowerCase())
    );

    return res.status(200).json({
      success: true,
      data: resultados,
      total: resultados.length
    });
  } catch (error) {
    console.error('Error al buscar procedimientos:', error);
    return res.status(500).json({
      success: false,
      message: "Error al buscar procedimientos"
    });
  }
};

// 🔹 Función para obtener un procedimiento por ID
export const obtenerProcedimientoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const procedimiento = procedimientosDB.find(item => item.id === parseInt(id));

    if (!procedimiento) {
      return res.status(404).json({
        success: false,
        message: `Procedimiento con ID ${id} no encontrado`
      });
    }

    return res.status(200).json({
      success: true,
      data: procedimiento
    });
  } catch (error) {
    console.error('Error al obtener procedimiento:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener el procedimiento"
    });
  }
};