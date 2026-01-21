import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

export class MedicoFiltro extends LitElement {
  static properties = {
    idContrato: { type: Number, attribute: 'id-contrato' },
    filtro: { type: String },
    selectedId: { type: String, attribute: 'selected-id' },

    users: { state: true },
    filtrados: { state: true },
    loading: { state: true },
    error: { state: true },
    abierto: { state: true },
    inicializado: { state: true }
  };

  constructor() {
    super();
    this.idContrato = null;
    this.filtro = '';
    this.selectedId = '';

    this.users = [];
    this.filtrados = [];
    this.loading = false;
    this.error = '';
    this.abierto = false;
    this.inicializado = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.idContrato) this.cargar();
  }

  updated(changedProps) {
    if (changedProps.has('idContrato') && this.idContrato) {
      this.cargar();
    }

    if (changedProps.has('filtro')) {
      this.aplicarFiltro(this.filtro);
    }

    // 🔥 autocompletar SOLO una vez
    if (
      changedProps.has('selectedId') &&
      this.selectedId &&
      !this.inicializado &&
      this.users.length
    ) {
      const medico = this.users.find(u => String(u.id) === String(this.selectedId));
      if (medico) {
        this.filtro = `${medico.nombre} (${medico.id})`;
        this.abierto = false;
        this.inicializado = true;
      }
    }
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    this.users = [];
    this.filtrados = [];
    this.inicializado = false;

    try {
      const res = await fetch('/roberto/profecional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idContrato: this.idContrato })
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();
      if (!data.ok || !Array.isArray(data.users)) {
        throw new Error(data.message || 'Respuesta inválida');
      }

      this.users = data.users;

      // 🔥 set inicial por fk_usuario
      if (this.selectedId) {
        const medico = this.users.find(u => String(u.id) === String(this.selectedId));
        if (medico) {
          this.filtro = `${medico.nombre} (${medico.id})`;
        }
      }

      this.aplicarFiltro(this.filtro);
      this.inicializado = true;

    } catch (err) {
      console.error('Error cargando médicos', err);
      this.error = 'Error cargando médicos';
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltro(valor) {
    const f = (valor || '').toLowerCase();

    this.filtrados = this.users.filter(u =>
      String(u.nombre || '').toLowerCase().includes(f) ||
      String(u.id || '').toLowerCase().includes(f)
    );

    this.abierto = true;
  }

  // 🔥 CLICK EN INPUT = limpiar + abrir lista
  onFocusInput() {
    if (this.selectedId) {
      this.filtro = '';
      this.selectedId = '';
      this.aplicarFiltro('');
    }

    this.abierto = true;
  }

  onInput(e) {
    const v = e.target.value;
    this.filtro = v;
    this.abierto = true;
    this.aplicarFiltro(v);
  }

  // 🔥 CLICK ÚNICO = seleccionar
  seleccionar(medico) {
    this.selectedId = String(medico.id);
    this.filtro = `${medico.nombre} (${medico.id})`;
    this.abierto = false;

    this.dispatchEvent(new CustomEvent('medico-seleccionado', {
      detail: medico,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="box">
        <label>Profesional</label>

        ${this.loading ? html`<div class="info">Cargando...</div>` : ''}

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        <input
          type="text"
          placeholder="Filtrar por nombre o ID"
          .value=${this.filtro}
          @focus=${this.onFocusInput}
          @input=${this.onInput}
          ?disabled=${this.loading}
        >

        ${this.abierto && this.filtrados.length
          ? html`
              <div class="lista">
                ${this.filtrados.map(u => html`
                  <div class="item" @click=${() => this.seleccionar(u)}>
                    ${u.nombre} (${u.id})
                  </div>
                `)}
              </div>
            `
          : ''}
      </div>
    `;
  }

  static styles = css`
    .box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: Arial, sans-serif;
      width: 320px;
      position: relative;
    }

    label {
      font-weight: bold;
    }

    input {
      padding: 6px;
      font-size: 14px;
    }

    .info {
      font-size: 12px;
      color: #555;
    }

    .error {
      font-size: 12px;
      color: red;
    }

    .lista {
      position: absolute;
      top: 66px;
      left: 0;
      right: 0;
      border: 1px solid #ccc;
      background: #fff;
      max-height: 180px;
      overflow-y: auto;
      z-index: 1000;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,.15);
    }

    .item {
      padding: 6px 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .item:hover {
      background: #eee;
    }
  `;
}

customElements.define('medico-filtro', MedicoFiltro);
