import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

// ============================================================
// TIPOS
// ============================================================
type HistoriaFila = [
  string, // 0: idHistoria
  string, // 1: código
  string, // 2: documento (con prefijo)
  string, // 3: nombre
  string, // 4: fecha
  string, // 5: hora
  string, // 6: ingreso
  string, // 7: estado
  string, // 8: idAdmision
  string  // 9: documento (solo números)
];

interface ApiRespuestaHistorias {
  aaData: HistoriaFila[];
  iTotalRecords?: number;
  iTotalDisplayRecords?: number;
  sEcho?: string;
}

// ============================================================
// EXPORTAMOS LA FUNCIÓN LÓGICA PARA REUTILIZAR
// ============================================================
export const consultarIdHistoria = async (
  documento: string | number
): Promise<{ idHistoria: string; fecha: string }> => {
  if (!documento) throw new Error('El campo "documento" es requerido');

  const docString = documento.toString().trim();
  const docLimpio = docString.replace(/[^0-9]/g, '');

  // ---------- TOKENS ----------
  const JWT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiUmJhcnJldG8iLCJqdGkiOiJhNTA2ODYwMS1jNDQxLTQ2ODktODk5MS00MGJiNWI3ZDQyM2MiLCJ1c2VybmFtZSI6IlJiYXJyZXRvIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoicmIucm9iZXJ0by5iYXJyZXRvQGdtYWlsLmNvbSIsImFkbWluIjoiTiIsInVzZXJpZCI6IjY4NzQiLCJpbnN0aXR1dGlvbiI6IjIwIiwicGFnb3MiOiIwIiwidmVyc2lvbiI6IjEuMC4wLjAiLCJlbnZpcm9ubWVudCI6IlByb2R1Y3Rpb24iLCJleHAiOjE3ODc2MTEzNDgsImlzcyI6InRlZ2V0dC5sb2dpbiIsImF1ZCI6InRlZ2V0dC5jb20ifQ.olr3bBbRXCVV_KCLDrBEDJOy7nOJwPX2OU5pa9hhP1A';

  const DATA_TOKEN =
    'Thy/75S/V++qUVTSCeKcpwOzw6sxZnoD4Ko376/YJ6g=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==';

  const headers = {
    authority: 'balance.saludplus.co',
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'es-419,es;q=0.9,en;q=0.8',
    authorization: `Bearer ${JWT_TOKEN}`,
    'content-type': 'application/x-www-form-urlencoded',
    data: DATA_TOKEN,
    origin: 'https://balance.saludplus.co',
    referer:
      'https://balance.saludplus.co/instituciones/?origen=1&theme=false&time=1787611145642',
    'sec-ch-ua': '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
    Cookie:
      '_ga=GA1.1.433661464.1772468883; twk_uuid_61e04197b84f7301d32ada9f=%7B%22uuid%22%3A%221.Sx13ycH3BdSXIYC93nkLL7P8utiEspFsyRC6v3rFzyv77ldcjYzsfqXuaTaW6tP7MyONDncUjmMd30TSB8c9Dla5OxkxxYcDd40zCfLeLMuU9OX5R5TLE%22%2C%22version%22%3A3%2C%22domain%22%3A%22saludplus.co%22%2C%22ts%22%3A1773241450106%7D; _clck=2l4g58%5E2%5Eg8v%5E0%5E2252; _ga_581YHK4S33=GS2.1.s1787610744$o203$g1$t1787611146$j59$l0$h0; _clsk=odbad3%5E1787611146904%5E8%5E1%5Ek.clarity.ms%2Fcollect',
  };

  const bodyData = new URLSearchParams({
    sEcho: '2',
    iColumns: '8',
    sColumns: ',CODIGO,DOCUMENTO,NOMBRE,FECHA,HORA,INGRESO,ESTADO',
    iDisplayStart: '0',
    iDisplayLength: '1000',
    mDataProp_0: '0',
    mDataProp_1: '1',
    mDataProp_2: '2',
    mDataProp_3: '3',
    mDataProp_4: '4',
    mDataProp_5: '5',
    mDataProp_6: '6',
    mDataProp_7: '7',
    sSearch: docString,
    bRegex: 'false',
    sSearch_0: '',
    bRegex_0: 'false',
    bSearchable_0: 'true',
    sSearch_1: '',
    bRegex_1: 'false',
    bSearchable_1: 'false',
    sSearch_2: '',
    bRegex_2: 'false',
    bSearchable_2: 'false',
    sSearch_3: '',
    bRegex_3: 'false',
    bSearchable_3: 'false',
    sSearch_4: '',
    bRegex_4: 'false',
    bSearchable_4: 'false',
    sSearch_5: '',
    bRegex_5: 'false',
    bSearchable_5: 'false',
    sSearch_6: '',
    bRegex_6: 'false',
    bSearchable_6: 'false',
    sSearch_7: '',
    bRegex_7: 'false',
    bSearchable_7: 'false',
    iSortingCols: '1',
    iSortCol_0: '0',
    sSortDir_0: 'asc',
    bSortable_0: 'true',
    bSortable_1: 'false',
    bSortable_2: 'false',
    bSortable_3: 'false',
    bSortable_4: 'false',
    bSortable_5: 'false',
    bSortable_6: 'false',
    bSortable_7: 'false',
  });

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const fechaLimite = new Date(2025, 0, 1);
  let fechaFin = new Date();
  let fechaInicio = new Date(fechaFin);
  fechaInicio.setMonth(fechaInicio.getMonth() - 6);

  let resultado: { idHistoria: string; fecha: string } | null = null;

  while (fechaFin >= fechaLimite) {
    const fechaInicioStr = formatDate(fechaInicio);
    const fechaFinStr = formatDate(fechaFin);

    try {
      const response = await axios.post<ApiRespuestaHistorias>(
        'https://balance.saludplus.co/historiasClinicas/BuscardorHistoriasDatos',
        bodyData.toString(),
        {
          headers,
          params: {
            estados: '',
            fechaInicial: fechaInicioStr,
            fechaFinal: fechaFinStr,
            idCaracteristica: '0',
            idActividad: '0',
            validarSede: 'True',
          },
          timeout: 30000,
        }
      );

      const { aaData } = response.data;
      if (aaData?.length) {
        const encontrado = aaData.find((fila) => {
          const docCol1 = fila[1]?.replace(/[^0-9]/g, '') || '';
          const docCol2 = fila[2]?.replace(/[^0-9]/g, '') || '';
          const docCol9 = fila[9]?.replace(/[^0-9]/g, '') || '';
          return docCol1 === docLimpio || docCol2 === docLimpio || docCol9 === docLimpio;
        });

        if (encontrado) {
          resultado = {
            idHistoria: encontrado[0],
            fecha: encontrado[4] || '',
          };
          break;
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const msg = status ? `Error API Historias (${status})` : error.message;
        throw new Error(msg);
      }
      throw error;
    }

    fechaFin = new Date(fechaInicio);
    fechaInicio = new Date(fechaFin);
    fechaInicio.setMonth(fechaInicio.getMonth() - 6);
  }

  if (resultado) {
    return resultado;
  } else {
    throw new Error(
      `No se encontró historia para el documento: ${documento} en el rango desde hoy hasta 01/01/2025`
    );
  }
};

// ============================================================
// MIDDLEWARE DE EXPRESS
// ============================================================
export const ConsultaIdHistoria = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { documento } = req.body;
    if (!documento) {
      res.status(400).json({ ok: false, error: 'Falta el campo "documento"' });
      return;
    }

    const resultado = await consultarIdHistoria(documento);
    res.status(200).json({
      ok: true,
      idHistoria: resultado.idHistoria,
      fecha: resultado.fecha,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ ok: false, error: error.message });
    } else {
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
  }
};