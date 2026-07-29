import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class LaboratorioProcedimientos extends LitElement {

  static properties = {
    procedimientos: { type: Array },
    filtro: { type: String }
  };

  constructor() {
    super();
    this.procedimientos = [];
    this.filtro = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.cargar();
  }

  async cargar() {
    try {
      const r = await fetch('/roberto/extrearProcedimiento');
      const data = await r.json();

      // Garantiza que la variable siempre sea un arreglo,
      // incluso si la API responde con un objeto envuelto { data: [...] }
      if (Array.isArray(data)) {
        this.procedimientos = data;
      } else if (Array.isArray(data?.data)) {
        this.procedimientos = data.data;
      } else if (Array.isArray(data?.procedimientos)) {
        this.procedimientos = data.procedimientos;
      } else {
        console.warn('La API no retornó un arreglo válido:', data);
        this.procedimientos = [];
      }
    } catch (error) {
      console.error('Error al cargar procedimientos:', error);
      this.procedimientos = [];
    }
  }

  seleccionar(p) {
    this.dispatchEvent(new CustomEvent('procedimiento-seleccionado', {
      detail: p,
      bubbles: true,
      composed: true
    }));
    this.filtro = '';
  }

  render() {
    // Asegura que siempre se ejecute .filter sobre un arreglo
    const items = Array.isArray(this.procedimientos) ? this.procedimientos : [];

    const lista = items.filter(p => {
      const filtroLower = this.filtro.toLowerCase();
      const nombreCoincide = p.nombre ? String(p.nombre).toLowerCase().includes(filtroLower) : false;
      const idCoincide = p.id ? String(p.id).includes(this.filtro) : false;
      const cupsCoincide = p.cups ? String(p.cups).toLowerCase().includes(filtroLower) : false;

      return nombreCoincide || idCoincide || cupsCoincide;
    });

    return html`
      <input
        type="text"
        placeholder="Buscar por ID, CUPS o Nombre..."
        .value=${this.filtro}
        @input=${e => this.filtro = e.target.value}
      >

      <ul>
        ${lista.length > 0 
          ? lista.map(p => html`
              <li @click=${() => this.seleccionar(p)}>
                ${p.id} | ${p.cups} | ${p.nombre}
              </li>
            `)
          : html`<li class="sin-resultados">No se encontraron procedimientos</li>`
        }
      </ul>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      margin-bottom: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    ul { 
      list-style: none; 
      padding: 0; 
      margin: 0;
      max-height: 200px; 
      overflow-y: auto; 
      border: 1px solid #ccc; 
      border-radius: 4px;
    }

    li { 
      padding: 8px; 
      cursor: pointer; 
      border-bottom: 1px solid #eee;
    }

    li:last-child {
      border-bottom: none;
    }

    li:hover { 
      background: #f0f0f0; 
    }

    .sin-resultados {
      color: #777;
      font-style: italic;
      cursor: default;
    }
    .sin-resultados:hover {
      background: transparent;
    }
  `;
}

customElements.define('laboratorio-procedimientos', LaboratorioProcedimientos);