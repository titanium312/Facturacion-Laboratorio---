import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

export class ListaEntidades extends LitElement {
  static properties = {
    entidades: { state: true },
    filtro: { state: true },
    fk_entidad: { type: String },
    entidadesFiltradas: { state: true },
    cargando: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 400px;
      position: relative;
    }
    .search-container {
      position: relative;
    }
    input {
      width: 100%;
      padding: 8px 30px 8px 8px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #888;
    }
    .clear-btn:hover {
      color: #555;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid #ccc;
      border-top: none;
      max-height: 200px;
      overflow-y: auto;
      position: absolute;
      width: 100%;
      background: white;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 0 0 4px 4px;
    }
    li {
      padding: 8px;
      cursor: pointer;
    }
    li:hover {
      background-color: #f0f0f0;
    }
    .selected {
      background-color: #e0f7fa;
    }
  `;

  constructor() {
    super();
    this.entidades = [];
    this.filtro = '';
    this.fk_entidad = '';
    this.entidadesFiltradas = [];
    this.cargando = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.cargarEntidades();
  }

  // 🔹 Observa cambios en fk_entidad para auto-seleccionar
  updated(changedProperties) {
    if (changedProperties.has('fk_entidad') && this.fk_entidad) {
      this.autoSeleccionarEntidad();
    }
  }

  async cargarEntidades() {
    this.cargando = true;
    try {
   const res = await fetch('/roberto/ListaEntidadesEps');

      this.entidades = await res.json();
      this.entidadesFiltradas = this.entidades;
      
      // Si ya tenemos fk_entidad, seleccionarla
      if (this.fk_entidad) {
        this.autoSeleccionarEntidad();
      }
    } catch (err) {
      console.error('Error cargando entidades', err);
    } finally {
      this.cargando = false;
    }
  }

  autoSeleccionarEntidad() {
    if (!this.fk_entidad || this.entidades.length === 0) return;
    
    const entidadEncontrada = this.entidades.find(
      ent => String(ent.id) === String(this.fk_entidad)
    );
    
    if (entidadEncontrada) {
      this.filtro = entidadEncontrada.nombre;
      this.entidadesFiltradas = [];
      
      // Dispara evento para informar al padre
      this.dispatchEvent(new CustomEvent('entidad-seleccionada', {
        detail: { fk_entidad: this.fk_entidad },
        bubbles: true,
        composed: true
      }));
    }
  }

  actualizarFiltro(e) {
    this.filtro = e.target.value;

    if (this.filtro === '') {
      // Si se limpia el filtro, también limpiamos selección
      this.fk_entidad = '';
      this.entidadesFiltradas = this.entidades;
    } else {
      this.entidadesFiltradas = this.entidades.filter(ent =>
        ent.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
  }

  seleccionarEntidad(entidad) {
    this.fk_entidad = String(entidad.id);
    this.filtro = entidad.nombre;
    this.entidadesFiltradas = []; // Cierra la lista al seleccionar

    this.dispatchEvent(new CustomEvent('entidad-seleccionada', {
      detail: { fk_entidad: this.fk_entidad },
      bubbles: true,
      composed: true
    }));
  }

  limpiarSeleccion() {
    this.filtro = '';
    this.fk_entidad = '';
    this.entidadesFiltradas = this.entidades;
    
    // Dispara evento para informar que se limpió
    this.dispatchEvent(new CustomEvent('entidad-seleccionada', {
      detail: { fk_entidad: '' },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          placeholder="Buscar entidad..."
          .value=${this.filtro}
          @input=${this.actualizarFiltro}
        />
        ${this.filtro ? html`
          <button class="clear-btn" @click=${this.limpiarSeleccion}>&times;</button>
        ` : ''}
        ${this.entidadesFiltradas.length > 0 ? html`
          <ul>
            ${this.entidadesFiltradas.map(ent => html`
              <li
                class=${String(ent.id) === this.fk_entidad ? 'selected' : ''}
                @click=${() => this.seleccionarEntidad(ent)}
              >
                ${ent.nombre}
              </li>
            `)}
          </ul>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('lista-entidades', ListaEntidades);