import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';
import './SelectorContrato.js';
import './MedicoFiltro.js';
import './LaboratorioProcedimientos.js';
import './Facturar.js';
import './LOOGUIN.js'; // login-component

class BuscadorPaciente extends LitElement {
  static properties = {
    numeroDocumento: { type: String },
    data: { type: Object },
    cargando: { type: Boolean },
    error: { type: String },
    contratoSeleccionado: { type: String },
    valoresProcedimientos: { type: Object },
    fkUsuario: { type: String },
    fkUsuarioHistoria: { type: String },
    procedimientosAgregados: { type: Array },
    facturaData: { type: Object },
    facturadorId: { type: Number },
    facturadorNombre: { type: String }
  };

  constructor() {
    super();
    this.numeroDocumento = '';
    this.data = null;
    this.cargando = false;
    this.error = '';
    this.contratoSeleccionado = '';
    this.valoresProcedimientos = {};
    this.fkUsuario = '';
    this.fkUsuarioHistoria = '';
    this.procedimientosAgregados = [];
    this.facturaData = null;
    this.facturadorId = null;
    this.facturadorNombre = '';
  }

  static styles = css`
    .card { border: 1px solid #ddd; border-radius: 10px; padding: 16px; max-width: 900px; font-family: Arial, sans-serif; background: #fafafa; margin: auto; }
    input { padding: 8px; margin-right: 8px; width: 220px; }
    button { padding: 8px 14px; cursor: pointer; }
    .error { color: red; margin-top: 10px; }
    .section { margin-top: 16px; padding-top: 10px; border-top: 1px solid #ccc; }
    .row { margin-bottom: 6px; }
    .label { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background: #eee; }
  `;

  render() {
    // 🔹 Si no hay facturador logueado, mostrar login
    if (!this.facturadorId) {
      return html`
        <div class="card">
          <h3>Login de facturador</h3>
          <login-component @login-success=${this.onLoginSuccess}></login-component>
        </div>
      `;
    }

    // 🔹 Si está logueado, mostrar buscador de paciente
    return html`
      <div class="card">
        <h3>Consulta de paciente</h3>

        <div class="row">
          <span class="label">Facturador:</span> ${this.facturadorNombre} (ID: ${this.facturadorId})
        </div>

        <input
          type="text"
          placeholder="Número de admisión"
          .value=${this.numeroDocumento}
          @input=${e => (this.numeroDocumento = e.target.value)}
        />

        <button @click=${this.buscar} ?disabled=${this.cargando}>
          ${this.cargando ? 'Buscando...' : 'Buscar'}
        </button>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
        ${this.data ? this.renderResultado() : ''}
        ${this.facturaData ? html`<boton-facturar .data=${this.facturaData}></boton-facturar>` : ''}
      </div>
    `;
  }

  // ----------------------------
  // 🔹 Login Success
  // ----------------------------
  onLoginSuccess(e) {
    this.facturadorId = e.detail.idFacturador;
    this.facturadorNombre = e.detail.nombre;
  }

  // ----------------------------
  // 🔹 Render paciente y procedimientos
  // ----------------------------
  renderResultado() {
    const item = this.data.resultadoCompleto?.[0];
    if (!item) return html`<div>No hay datos</div>`;

    const { paciente, historia } = item;

    if (!this.fkUsuarioHistoria) {
      this.fkUsuarioHistoria = historia.fk_usuario || '';
      this.fkUsuario = this.fkUsuarioHistoria;
    }

    const procedimientosValidosOriginales = historia.todos_procedimientos.filter(
      p => p.nombreProcedimiento !== 'Procedimiento no encontrado'
    );

    const procedimientosValidos = [
      ...procedimientosValidosOriginales,
      ...this.procedimientosAgregados
    ];

    return html`
      <div class="section">
        <h4>📌 Meta respuesta</h4>
        <div class="row"><span class="label">OK:</span> ${this.data.ok}</div>
        <div class="row"><span class="label">Número consultado:</span> ${this.data.numeroDocumento}</div>
        <div class="row"><span class="label">Fecha consulta:</span> ${this.data.fechaConsulta}</div>
      </div>

      <div class="section">
        <h4>👤 Paciente</h4>
        ${Object.entries(paciente).map(
          ([k, v]) => html`<div class="row"><span class="label">${k}:</span> ${v}</div>`
        )}
      </div>

      <div class="section">
        <h4>📂 Historia</h4>

        <selector-contrato
          identidad="${historia.fk_entidad}"
          fechaemision="${this.formatFechaISO(historia.fecha_admision)}"
          @contrato-seleccionado=${this.onContratoSeleccionado}>
        </selector-contrato>

        ${this.contratoSeleccionado
          ? html`
              <div class="row">
                <span class="label">fk_contrato_entidad:</span>
                ${this.contratoSeleccionado}
              </div>

              <medico-filtro
                id-contrato="${this.contratoSeleccionado}"
                .filtro=${this.fkUsuarioHistoria}
                .selectedId=${this.fkUsuario}
                @medico-seleccionado=${this.onMedicoSeleccionado}>
              </medico-filtro>
            `
          : ''}

        ${Object.entries(historia).map(([k, v]) => {
          if (k === 'todos_procedimientos' || k === 'conteo_procedimientos') return '';
          if (k === 'fecha_admision') return html`<div class="row"><span class="label">fecha_admision:</span>${this.formatFecha(v)}</div>`;
          return html`<div class="row"><span class="label">${k}:</span> ${v}</div>`;
        })}
      </div>

      <div class="section">
        <h4>🧪 Procedimientos</h4>
        ${this.renderTablaProcedimientos(procedimientosValidos)}
        ${this.contratoSeleccionado ? this.renderTotal(procedimientosValidos) : ''}
        ${this.contratoSeleccionado ? html`<button @click=${() => this.prepararFactura(procedimientosValidos)}>Generar Factura</button>` : ''}
      </div>
    `;
  }

  renderTablaProcedimientos(lista) {
    if (!lista || lista.length === 0) return html`<div class="row">No hay registros</div>`;

    return html`
      <laboratorio-procedimientos @procedimiento-seleccionado=${this.onProcedimientoAgregado}></laboratorio-procedimientos>

      <table>
        <thead>
          <tr>
            <th>tipo</th>
            <th>cantidad</th>
            <th>fk_procedimiento</th>
            <th>cup</th>
            <th>nombreProcedimiento</th>
            <th>valor</th>
            <th>acciones</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map(p => {
            const valor = this.valoresProcedimientos[p.fk_procedimiento] ?? 0;
            return html`
              <tr>
                <td>${p.tipo ?? ''}</td>
                <td>${p.cantidad ?? ''}</td>
                <td>${p.fk_procedimiento ?? ''}</td>
                <td>${p.cup ?? ''}</td>
                <td>${p.nombreProcedimiento ?? ''}</td>
                <td>$${valor.toLocaleString()}</td>
                <td>
                  <button @click=${() => this.eliminarProcedimiento(p.fk_procedimiento)}>❌</button>
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  async cargarValoresProcedimientos(listaProcedimientos) {
    if (!this.contratoSeleccionado) return;

    const nuevosValores = { ...this.valoresProcedimientos };

    for (const p of listaProcedimientos) {
      if (!p.fk_procedimiento) continue;
      if (nuevosValores[p.fk_procedimiento] !== undefined) continue;

      try {
        const resp = await fetch(
          `/roberto/valorPRocedimiento?idContrato=${encodeURIComponent(this.contratoSeleccionado)}&idProcedimiento=${encodeURIComponent(p.fk_procedimiento)}`
        );
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const json = await resp.json();
        nuevosValores[p.fk_procedimiento] = json.valor ?? 0;
      } catch {
        nuevosValores[p.fk_procedimiento] = 0;
      }
    }

    this.valoresProcedimientos = nuevosValores;
  }

  async onContratoSeleccionado(e) {
    this.contratoSeleccionado = e.detail.id_contrato_entidad;
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    this.fkUsuarioHistoria = historia?.fk_usuario || '';
    this.fkUsuario = this.fkUsuarioHistoria;
    this.procedimientosAgregados = [];
    await this.cargarValoresProcedimientos(historia.todos_procedimientos || []);
    this.requestUpdate();
  }

  async onProcedimientoAgregado(e) {
    const p = e.detail;
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    const existe = historia.todos_procedimientos.some(x => x.fk_procedimiento === p.id) ||
                   this.procedimientosAgregados.some(x => x.fk_procedimiento === p.id);
    if (existe) return;

    const nuevoProc = {
      fk_procedimiento: p.id,
      cup: p.cups,
      nombreProcedimiento: p.nombre,
      tipo: 'diagnóstico',
      cantidad: 1
    };

    this.procedimientosAgregados = [...this.procedimientosAgregados, nuevoProc];
    await this.cargarValoresProcedimientos([nuevoProc]);
    this.requestUpdate();
  }

  eliminarProcedimiento(id) {
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    if (!historia) return;

    historia.todos_procedimientos = historia.todos_procedimientos.filter(p => p.fk_procedimiento !== id);
    this.procedimientosAgregados = this.procedimientosAgregados.filter(p => p.fk_procedimiento !== id);

    this.requestUpdate();
  }

  onMedicoSeleccionado = e => {
    const nuevo = String(e.detail.id);
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    if (!historia) return;
    historia.fk_usuario = nuevo;
    this.fkUsuario = nuevo;
    this.fkUsuarioHistoria = nuevo;
  };

  renderTotal(lista) {
    let total = 0;
    for (const p of lista) {
      const valor = this.valoresProcedimientos[p.fk_procedimiento] || 0;
      total += valor * (p.cantidad || 1);
    }

    return html`<div class="row" style="margin-top:10px;font-size:18px"><b>Total factura:</b> $${total.toLocaleString()}</div>`;
  }

  formatFecha(dotNetDate) {
    if (!dotNetDate) return 'N/A';
    const match = /\/Date\((\d+)\)\//.exec(dotNetDate);
    if (!match) return dotNetDate;
    return new Date(Number(match[1])).toLocaleDateString();
  }

  formatFechaISO(dotNetDate) {
    if (!dotNetDate) return '';
    const match = /\/Date\((\d+)\)\//.exec(dotNetDate);
    if (!match) return '';
    return new Date(Number(match[1])).toISOString().split('T')[0];
  }

  async buscar() {
    if (!this.numeroDocumento) {
      this.error = 'Debe ingresar un número de admisión';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.data = null;
    this.contratoSeleccionado = '';
    this.valoresProcedimientos = {};
    this.fkUsuario = '';
    this.fkUsuarioHistoria = '';
    this.procedimientosAgregados = [];
    this.facturaData = null;

    try {
      const resp = await fetch(`/roberto/jsoncompleto?numeroDocumento=${encodeURIComponent(this.numeroDocumento)}`);
      const json = await resp.json();
      if (!json.ok) throw new Error();
      this.data = json;
    } catch {
      this.error = 'No se pudo consultar el paciente';
    } finally {
      this.cargando = false;
    }
  }

  // ----------------------------
  // 🔹 Preparar datos de factura
  // ----------------------------
  prepararFactura(listaProcedimientos) {
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    if (!historia || !this.contratoSeleccionado) return;

    const procedimientosFacturar = listaProcedimientos.map(p => ({
      fk_procedimiento: p.fk_procedimiento,
      valor_unitario: this.valoresProcedimientos[p.fk_procedimiento] || 0,
      fk_usuario: this.fkUsuario || historia.fk_usuario,
      IdServicio: 706 // siempre fijo
    }));

    this.facturaData = {
      fk_entidad: historia.fk_entidad,
      fk_paciente: historia.fk_paciente,
      fk_contrato_entidad: this.contratoSeleccionado,
      procedimientos: procedimientosFacturar,
      FacturadorId: this.facturadorId // 🔹 enviamos ID del facturador
    };

    this.requestUpdate();
  }
}

customElements.define('buscador-paciente', BuscadorPaciente);
