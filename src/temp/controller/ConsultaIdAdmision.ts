// controller/generarHistoriaClinica.ts
import { Request, Response } from 'express';
import * as CryptoJS from 'crypto-js';
import { consultarIdHistoria } from './historia'; // importa función pura

// ---------- Constantes fijas ----------
const INSTITUCION_ID = 20;
const USER_ID = 6874;
const NIT_FIJO = 'NIT_812001219';

// ---------- Funciones internas (helpers, createToken, etc.) ----------
function createToken(reportName: string, institucionId: number, idCaracteristica: number, userId: number): string {
  const now = new Date();
  const dateini = new Date(now.getTime() + 86400000);
  let tokenOut = reportName;
  if (tokenOut.length < 16) tokenOut = tokenOut.padEnd(16, '0');
  else if (tokenOut.length > 16) tokenOut = tokenOut.substring(0, 16);
  const key = CryptoJS.enc.Utf8.parse(tokenOut);
  const iv = CryptoJS.enc.Utf8.parse(tokenOut);
  const data = { institucionId: Number(institucionId), userId, expiration: dateini.getTime(), permiso: { Caracteristica: idCaracteristica } };
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString().replace(/\+/g, 'xMl3Jk').replace(/\//g, 'Por21Ld').replace(/=/g, 'Ml32');
}

function formatDateDDMMYYYY(date: Date | string): string {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function construirContextoRenombramiento(ids: any, idAdmision: number, institucionId: number) {
  const nit = NIT_FIJO;
  const tipoId = (ids?.tipoDocumento || 'CC').toString().toUpperCase();
  const numId = (ids?.numero_documento || '0000000000').toString();
  const factura = ids?.numeroFactura || '0';
  return { nit, tipoId, numId, factura: String(factura), institucionId: Number(institucionId), idAdmision: Number(idAdmision) };
}

function generarNombreArchivo(ctx: any): string {
  return `HAU_${ctx.nit}_${ctx.factura}.pdf`;
}

// ---------- Función de negocio pura (no depende de req/res) ----------
async function generarHistoriaClinicaLogic(clave: string): Promise<any> {
  // 1. Obtener idHistoria
  let idHistoria: string;
  try {
    const result = await consultarIdHistoria(clave);
    idHistoria = result.idHistoria;
  } catch (error) {
    throw new Error(`No se pudo obtener la historia clínica: ${error instanceof Error ? error.message : error}`);
  }

  const resolvedAdmisionId = 0;
  const idsStub = { id_admision: null, numeroFactura: clave, tipoDocumento: 'CC', numero_documento: clave };
  const ctx = construirContextoRenombramiento(idsStub, resolvedAdmisionId, INSTITUCION_ID);

  // 🔹 Cambio 1: Módulo corregido
  const reporte = 'ListadoHistoriasClinicasDetallado3';
  const modulo = 'HistoriasClinicas';  // ← Cambiado de 'Asistencial' a 'HistoriasClinicas'

  // 🔹 Ya no necesitamos estas constantes
  // const FECHA_INICIAL_FIJA = '01/01/2023';
  // const FECHA_FINAL_HOY = formatDateDDMMYYYY(new Date());

  const tokenReporte = createToken(reporte, INSTITUCION_ID, 83, USER_ID);

  // 🔹 Cambio 2: Eliminar fechaInicial y fechaFinal de los parámetros
  const urlParams = new URLSearchParams({
    modulo,
    reporte,
    render: 'pdf',
    hideTool: 'true',
    environment: '1',
    userId: String(USER_ID),
    idsHistorias: idHistoria,
    token: tokenReporte,
    // fechaInicial: FECHA_INICIAL_FIJA,  // ← Eliminado
    // fechaFinal: FECHA_FINAL_HOY,       // ← Eliminado
  });

  // 🔹 Cambio 3: URL con /View.aspx (V mayúscula)
  const url = `https://reportes.saludplus.co/View.aspx?${urlParams.toString()}`;
  const nombrepdf = generarNombreArchivo(ctx);

  return {
    numeroAdmision: String(resolvedAdmisionId),
    numeroFactura: ctx.factura,
    url,
    nombrepdf,
  };
}

// ---------- MIDDLEWARE DE EXPRESS ----------
export async function generarHistoriaClinica(req: Request, res: Response): Promise<void> {
  try {
    const { clave } = req.body;
    if (!clave) {
      res.status(400).json({ ok: false, error: 'Falta el campo "clave"' });
      return;
    }
    const resultado = await generarHistoriaClinicaLogic(clave);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ ok: false, error: error instanceof Error ? error.message : 'Error interno' });
  }
}
