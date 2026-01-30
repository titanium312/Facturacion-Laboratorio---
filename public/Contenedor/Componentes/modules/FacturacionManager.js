import { Utils } from './utils.js';

export class FacturacionManager {
  constructor(component) {
    this.component = component;
  }

  // 🔹 Métodos para facturación por admisión
  prepararFacturaAdmision(listaProcedimientos) {
    const item = this.component.data?.resultadoCompleto?.[0];
    const historia = item?.historia;
    
    if (!historia || !this.component.contratoSeleccionado) {
      throw new Error('Datos incompletos para facturación');
    }

    const procedimientosFacturar = this.crearProcedimientosFacturar(listaProcedimientos);
    const fechaActual = Utils.getFechaActual();

    return {
      fk_entidad: historia.fk_entidad,
      fk_paciente: historia.fk_paciente,
      fk_contrato_entidad: this.component.contratoSeleccionado,
      FacturadorId: this.component.facturadorId,
      procedimientos: procedimientosFacturar,
      fecha_admision: fechaActual,
      fecha_remision: fechaActual,
      fecha_emision: fechaActual
    };
  }

  // 🔹 Métodos para facturación por documento
  validarDatosFacturacionDocumento() {
    if (!this.component.pacienteDocumentoEncontrado || 
        !this.component.contratoSeleccionado || 
        !this.component.fkUsuario) {
      throw new Error('Complete todos los campos requeridos para facturar');
    }
    return true;
  }

  prepararFacturaDocumento(listaProcedimientos) {
    this.validarDatosFacturacionDocumento();

    const procedimientosFacturar = this.crearProcedimientosFacturar(listaProcedimientos);
    const fechaActual = Utils.getFechaActual();

    return {
      fk_entidad: this.component.pacienteDocumentoEncontrado.fk_entidad,
      fk_paciente: this.component.pacienteDocumentoEncontrado.fk_paciente,
      fk_contrato_entidad: this.component.contratoSeleccionado,
      FacturadorId: this.component.facturadorId,
      numeroAdmision: this.component.admisionManual || 'MANUAL-' + Date.now(),
      procedimientos: procedimientosFacturar,
      fecha_admision: fechaActual,
      fecha_remision: fechaActual,
      fecha_emision: fechaActual
    };
  }

  // 🔹 Métodos compartidos
  crearProcedimientosFacturar(listaProcedimientos) {
    return listaProcedimientos.map(p => ({
      fk_procedimiento: p.fk_procedimiento,
      valor_unitario: this.component.valoresProcedimientos[p.fk_procedimiento] || 0,
      fk_usuario: this.component.fkUsuario || this.component.fkUsuarioHistoria,
      IdServicio: 706
    }));
  }

  async cargarValorProcedimiento(idProcedimiento) {
    if (!this.component.contratoSeleccionado || !idProcedimiento) {
      return 0;
    }

    try {
      const resp = await fetch(
        `/roberto/valorPRocedimiento?idContrato=${encodeURIComponent(this.component.contratoSeleccionado)}&idProcedimiento=${encodeURIComponent(idProcedimiento)}`
      );
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();
      return json.valor ?? 0;
    } catch {
      return 0;
    }
  }

  async cargarValoresProcedimientos(listaProcedimientos) {
    if (!this.component.contratoSeleccionado) return;

    const nuevosValores = { ...this.component.valoresProcedimientos };
    const promesas = [];

    for (const p of listaProcedimientos) {
      if (!p.fk_procedimiento) continue;
      if (nuevosValores[p.fk_procedimiento] !== undefined) continue;

      promesas.push(
        this.cargarValorProcedimiento(p.fk_procedimiento)
          .then(valor => {
            nuevosValores[p.fk_procedimiento] = valor;
          })
      );
    }

    await Promise.all(promesas);
    this.component.valoresProcedimientos = nuevosValores;
  }
}