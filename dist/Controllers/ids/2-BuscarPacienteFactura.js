"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarPaciente = exports.buscarPacienteData = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const BASE_URL = "https://balance.saludplus.co";
// 🔹 Fecha de hoy en formato MM/DD/YYYY
const hoy = new Date();
const pad = (n) => String(n).padStart(2, "0");
const FECHA_FINAL = `${pad(hoy.getMonth() + 1)}/${pad(hoy.getDate())}/${hoy.getFullYear()}`;
// 🔁 Helper para POST
const postRequest = async (url, payload, headers, timeout = 45000) => {
    try {
        const { data } = await axios_1.default.post(url, qs_1.default.stringify(payload), { headers, timeout });
        return Array.isArray(data?.aaData) ? data.aaData : [];
    }
    catch (err) {
        console.error(`❌ postRequest ${url}:`, err.message);
        return [];
    }
};
// 🔹 FUNCIÓN REUTILIZABLE (la que usará jsoncompleto)
const buscarPacienteData = async (numero) => {
    const clean = String(numero ?? "").trim();
    if (!clean)
        return [];
    const TOKEN = "VXvFlno2tbPgBXN0PbP3jjesFsDJx7uSQjpHJCDSplk=.1SS9/UCeyjpq9PyT8MBqPg==.wcFkBNOeMUO3EbN8I4nUXw==";
    const HEADERS_BALANCE = {
        data: TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const payload = {
        estados: "",
        fechaInicial: "01/01/2024",
        fechaFinal: FECHA_FINAL,
        idCaracteristica: 0,
        idActividad: 0,
        validarSede: "True",
        sEcho: 2,
        iColumns: 10,
        sColumns: ",CODIGO,DOCUMENTO,NOMBRE,FECHA,HORA,INGRESO,ESTADO,ID_ADMISION,NUMERO_ADMISION",
        iDisplayStart: 0,
        iDisplayLength: 100,
        mDataProp_0: 0,
        mDataProp_1: 1,
        mDataProp_2: 2,
        mDataProp_3: 3,
        mDataProp_4: 4,
        mDataProp_5: 5,
        mDataProp_6: 6,
        mDataProp_7: 7,
        mDataProp_8: 8,
        mDataProp_9: 9,
        sSearch: clean,
        bRegex: false,
        iSortingCols: 1,
        iSortCol_0: 0,
        sSortDir_0: "asc",
    };
    const historiasRaw = await postRequest(`${BASE_URL}/historiasClinicas/BuscardorHistoriasDatos`, payload, HEADERS_BALANCE);
    return historiasRaw
        .filter(r => r[9] === clean)
        .map(r => ({
        idHistoria: r[0],
        numeroDocumento: r[2],
        nombre: r[3],
        idAdmision: r[8],
        numeroAdmision: r[9],
    }));
};
exports.buscarPacienteData = buscarPacienteData;
// 🔹 ENDPOINT NORMAL (sigue funcionando igual)
const buscarPaciente = async (req, res) => {
    try {
        const numero = String(req.body?.sSearch ?? req.query?.sSearch ?? "").trim();
        if (!numero) {
            return res.status(400).json({ ok: false, message: "Debe enviar sSearch" });
        }
        const historias = await (0, exports.buscarPacienteData)(numero);
        return res.json({
            ok: true,
            numeroBusqueda: numero,
            fechaConsulta: FECHA_FINAL,
            resultados: historias,
        });
    }
    catch (e) {
        console.error("❌ buscarPaciente:", e);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
};
exports.buscarPaciente = buscarPaciente;
