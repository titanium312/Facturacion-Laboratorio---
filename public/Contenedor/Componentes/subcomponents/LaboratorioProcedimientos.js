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
    const r = await fetch('/roberto/extrearProcedimiento');
    this.procedimientos = await r.json();
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
    const lista = this.procedimientos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      String(p.id).includes(this.filtro)
    );

    return html`
      <input
        placeholder="Buscar procedimiento..."
        .value=${this.filtro}
        @input=${e => this.filtro = e.target.value}
      >

      <ul>
        ${lista.map(p => html`
          <li @click=${() => this.seleccionar(p)}>
            ${p.id} | ${p.cups} | ${p.nombre}
          </li>
        `)}
      </ul>
    `;
  }

  static styles = css`
    ul { list-style:none; padding:0; max-height:200px; overflow:auto; border:1px solid #ccc; }
    li { padding:6px; cursor:pointer; }
    li:hover { background:#eee; }
  `;
}

customElements.define('laboratorio-procedimientos', LaboratorioProcedimientos);
