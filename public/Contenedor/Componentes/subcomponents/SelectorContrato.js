import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class SelectorContrato extends LitElement {
  static properties = {
    fechaEmision: { type: String, attribute: 'fechaemision' },
    idEntidad: { type: String, attribute: 'identidad' },
    contratos: { type: Array },
    cargando: { type: Boolean },
    error: { type: String },
    seleccionado: { type: String }
  };

  constructor() {
    super();
    this.fechaEmision = '';
    this.idEntidad = '';
    this.contratos = [];
    this.cargando = false;
    this.error = '';
    this.seleccionado = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.fechaEmision && this.idEntidad) {
      this.buscarContratos();
    }
  }

  updated(changed) {
    if (
      (changed.has('fechaEmision') || changed.has('idEntidad')) &&
      this.fechaEmision &&
      this.idEntidad
    ) {
      this.buscarContratos();
    }
  }

  static styles = css`
    .card {
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 16px;
      max-width: 600px;
      font-family: Arial, sans-serif;
      background: #fafafa;
    }

    .row {
      margin-bottom: 10px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 4px;
    }

    input, select, button {
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    button {
      margin-top: 10px;
      cursor: pointer;
    }

    .error {
      color: red;
      margin-top: 10px;
    }

    .loading {
      color: #666;
      margin-top: 10px;
    }
  `;

render() {

  return html`
    <div class="card">
      ${this.contratos.length > 0
        ? html`
            <div class="row">
              <label>Contratos disponibles</label>
              <select
                .value=${this.seleccionado}
                @change=${this.onSeleccionar}
              >
                <option value="">-- Seleccione un contrato --</option>
                ${this.contratos.map(c => html`
                  <option value=${c.id_contrato_entidad}>
                    ${c.descripcion_contrato}
                  </option>
                `)}
              </select>
            </div>
          `
        : ''}
    </div>
  `;
}

  async buscarContratos() {
    if (!this.fechaEmision || !this.idEntidad) {
      this.error = 'Debe ingresar fecha de emisión e ID de entidad';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.contratos = [];
    this.seleccionado = '';

    try {
      const resp = await fetch(
        `/roberto/contratos-validos?fechaEmision=${encodeURIComponent(
          this.fechaEmision
        )}&idEntidad=${encodeURIComponent(this.idEntidad)}`
      );

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inválida');

      this.contratos = data;

      // 🔥 Auto seleccionar si solo hay uno
      if (data.length === 1) {
        this.seleccionado = data[0].id_contrato_entidad;
        this.emitirSeleccion();
      }

    } catch (err) {
      console.error(err);
      this.error = 'No se pudieron cargar los contratos';
    } finally {
      this.cargando = false;
    }
  }

  onSeleccionar(e) {
    this.seleccionado = e.target.value;
    this.emitirSeleccion();
  }

  emitirSeleccion() {
    this.dispatchEvent(new CustomEvent('contrato-seleccionado', {
      detail: {
        id_contrato_entidad: this.seleccionado
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('selector-contrato', SelectorContrato);
