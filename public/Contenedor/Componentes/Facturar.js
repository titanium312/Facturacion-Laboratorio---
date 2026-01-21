import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class BotonFacturar extends LitElement {
  static properties = {
    data: { type: Object },      // Datos de facturación (incluye FacturadorId)
    cargando: { type: Boolean }, // Estado de carga
    mensaje: { type: String },   // Mensaje de feedback
    success: { type: Boolean }   // Indica éxito o error
  };

  constructor() {
    super();
    this.data = {};
    this.cargando = false;
    this.mensaje = '';
    this.success = false;
  }

  static styles = css`
    button {
      padding: 10px 16px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid #333;
      background: #4caf50;
      color: white;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .mensaje {
      margin-top: 8px;
      font-weight: bold;
    }
    .error { color: red; }
    .ok { color: green; }
  `;

  render() {
    return html`
      <button @click=${this.facturar} ?disabled=${this.cargando}>
        ${this.cargando ? 'Facturando...' : 'Facturar'}
      </button>
      ${this.mensaje
        ? html`<div class="mensaje ${this.success ? 'ok' : 'error'}">${this.mensaje}</div>`
        : ''}
    `;
  }

  async facturar() {
    // Validaciones iniciales
    if (!this.data || typeof this.data !== 'object') {
      this.mensaje = 'No se proporcionó data válida';
      this.success = false;
      return;
    }

    const { fk_entidad, fk_paciente, fk_contrato_entidad, procedimientos, FacturadorId } = this.data;

    if (!fk_entidad || !fk_paciente || !fk_contrato_entidad || !FacturadorId) {
      this.mensaje = 'Faltan datos obligatorios: fk_entidad, fk_paciente, fk_contrato_entidad o FacturadorId';
      this.success = false;
      return;
    }

    if (!Array.isArray(procedimientos) || procedimientos.length === 0) {
      this.mensaje = 'Debe haber al menos un procedimiento';
      this.success = false;
      return;
    }

    for (const p of procedimientos) {
      if (!p.fk_procedimiento || !p.valor_unitario || !p.fk_usuario || !p.IdServicio) {
        this.mensaje = 'Cada procedimiento debe tener fk_procedimiento, valor_unitario, fk_usuario e IdServicio';
        this.success = false;
        return;
      }
    }

    this.cargando = true;
    this.mensaje = '';
    this.success = false;

    try {
      // Fechas por defecto si no vienen
      const hoy = new Date();
      const formatoFecha = (fecha) => `${String(fecha.getDate()).padStart(2,'0')}/${String(fecha.getMonth()+1).padStart(2,'0')}/${fecha.getFullYear()}`;

      const payload = {
        ...this.data,
        fecha_admision: this.data.fecha_admision || formatoFecha(hoy),
        fecha_remision: this.data.fecha_remision || formatoFecha(hoy),
        fecha_emision: this.data.fecha_emision || formatoFecha(hoy)
      };

      // Petición al backend
      const resp = await fetch('/roberto/subir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await resp.json();

      if (json.success) {
        this.mensaje = json.data?.mensajeRetorno || 'Facturación exitosa';
        this.success = true;
      } else {
        this.mensaje = json.data?.mensajeRetorno || 'Error al facturar';
        this.success = false;
      }

    } catch (err) {
      console.error(err);
      this.mensaje = 'Error al conectar con el servidor';
      this.success = false;
    } finally {
      this.cargando = false;
    }
  }
}

customElements.define('boton-facturar', BotonFacturar);
