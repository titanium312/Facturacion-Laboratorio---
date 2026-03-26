import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class ListaEntidades extends LitElement {
  static properties = {
    fk_entidad: { type: String },
    entidades: { type: Array },
    filtro: { type: String },
    cargando: { type: Boolean }
  };

  static styles = css`
    :host { 
      display: block; 
      margin-bottom: 15px; 
      font-family: sans-serif;
    }
    .select-container { 
      display: flex; 
      flex-direction: column; 
      gap: 5px; 
    }
    select {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }
    select:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
    }
    /* Corregido el error del linter aquí */
    .loading { 
      font-size: 12px; 
      color: #666; 
      font-style: italic; 
    }
  `;

  constructor() {
    super();
    this.entidades = [];
    this.fk_entidad = '';
    this.cargando = false;
    this.filtro = '';
  }

  firstUpdated() {
    this.cargarEntidades();
  }

  async cargarEntidades() {
    this.cargando = true;
    try {
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos de ejemplo
      this.entidades = [
        { id: '1', nombre: 'SURamericana' },
        { id: '2', nombre: 'Sanitas' },
        { id: '3', nombre: 'Nueva EPS' },
        { id: '4', nombre: 'Salud Total' },
        { id: '5', nombre: 'Particular' }
      ];
    } catch (e) {
      console.error("Error cargando entidades", e);
    } finally {
      this.cargando = false;
    }
  }

  _manejarCambio(e) {
    const valor = e.target.value;
    this.fk_entidad = valor;

    // Disparar evento para BuscadorPaciente.js
    this.dispatchEvent(new CustomEvent('entidad-seleccionada', {
      detail: { fk_entidad: valor },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="select-container">
        <label><strong>Hospital / Entidad (EPS):</strong></label>
        
        <select .value=${this.fk_entidad} @change=${this._manejarCambio}>
          <option value="">-- Seleccione una entidad --</option>
          ${this.entidades.map(ent => html`
            <option 
              value="${ent.id}" 
              ?selected=${String(this.fk_entidad) === String(ent.id)}>
              ${ent.nombre}
            </option>
          `)}
        </select>

        ${this.cargando ? html`<span class="loading">Cargando lista de convenios...</span>` : ''}
      </div>
    `;
  }
}

customElements.define('lista-entidades', ListaEntidades);