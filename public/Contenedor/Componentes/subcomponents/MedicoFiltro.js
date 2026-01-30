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
    medicoSeleccionado: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 400px;
      position: relative;
    }

    .search-container {
      position: relative;
    }

    input {
      width: 100%;
      padding: 12px 70px 12px 40px;
      box-sizing: border-box;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      font-size: 14px;
      background-color: #fff;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    input:hover {
      border-color: #2196F3;
    }

    input:focus {
      outline: none;
      border-color: #2196F3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      border-color: #e0e0e0;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #757575;
      font-size: 18px;
      pointer-events: none;
    }

    .clear-btn {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      background: #f44336;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .clear-btn:hover {
      background: #d32f2f;
      transform: translateY(-50%) scale(1.1);
    }

    .dropdown-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: #757575;
      padding: 4px 8px;
      transition: transform 0.2s ease;
    }

    .dropdown-btn:hover {
      color: #2196F3;
    }

    .dropdown-btn.abierto {
      transform: translateY(-50%) rotate(180deg);
    }

    ul {
      list-style: none;
      margin: 4px 0 0 0;
      padding: 0;
      border: 2px solid #2196F3;
      max-height: 280px;
      overflow-y: auto;
      position: absolute;
      width: 100%;
      background: white;
      z-index: 1000;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      border-radius: 8px;
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ul::-webkit-scrollbar {
      width: 8px;
    }

    ul::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 0 8px 8px 0;
    }

    ul::-webkit-scrollbar-thumb {
      background: #2196F3;
      border-radius: 4px;
    }

    ul::-webkit-scrollbar-thumb:hover {
      background: #1976D2;
    }

    li {
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.15s ease;
      border-bottom: 1px solid #f0f0f0;
    }

    li:last-child {
      border-bottom: none;
    }

    li:hover {
      background-color: #E3F2FD;
      padding-left: 20px;
    }

    .selected {
      background-color: #2196F3;
      color: white;
    }

    .selected:hover {
      background-color: #1976D2;
    }

    .selected .medico-id {
      color: rgba(255, 255, 255, 0.8);
    }

    .medico-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .medico-nombre {
      font-weight: 500;
      color: #212121;
      font-size: 14px;
    }

    .selected .medico-nombre {
      color: white;
    }

    .medico-id {
      font-size: 12px;
      color: #757575;
      font-weight: 400;
    }

    .checkmark {
      color: #4CAF50;
      font-size: 18px;
      font-weight: bold;
    }

    .loading {
      color: #2196F3;
      font-size: 13px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading::before {
      content: "⏳";
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error {
      color: #f44336;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px;
      background-color: #ffebee;
      border-radius: 4px;
      border-left: 3px solid #f44336;
    }

    .auto-selected {
      color: #4CAF50;
      font-size: 12px;
      margin-top: 8px;
      padding: 8px;
      background-color: #E8F5E9;
      border-radius: 4px;
      border-left: 3px solid #4CAF50;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: #9e9e9e;
      font-size: 13px;
    }
  `;

  constructor() {
    super();
    this.idContrato = null;
    this.filtro = '';
    this.selectedId = '';
    this.medicoSeleccionado = null;
    this.users = [];
    this.filtrados = [];
    this.loading = false;
    this.error = '';
    this.abierto = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.idContrato) this.cargar();
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (!this.contains(e.target)) {
      this.abierto = false;
    }
  }

  updated(changedProps) {
    if (changedProps.has('idContrato') && this.idContrato) {
      this.cargar();
    }
    if (changedProps.has('selectedId') && this.selectedId !== this.medicoSeleccionado?.id) {
      this.autoSeleccionarMedico();
    }
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    this.users = [];
    this.filtrados = [];
    this.abierto = false;

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
      this.filtrados = [];

      if (this.selectedId) {
        this.autoSeleccionarMedico();
      }
    } catch (err) {
      console.error('Error cargando médicos', err);
      this.error = 'Error al cargar la lista de médicos';
    } finally {
      this.loading = false;
    }
  }

  autoSeleccionarMedico() {
    if (!this.selectedId || this.users.length === 0) return;

    const medico = this.users.find(u => String(u.id) === String(this.selectedId));
    
    if (medico) {
      this.medicoSeleccionado = medico;
      this.filtro = `${medico.nombre} (ID: ${medico.id})`;
      this.abierto = false;
      this.dispatchEvent(new CustomEvent('medico-seleccionado', {
        detail: medico,
        bubbles: true,
        composed: true
      }));
    }
  }

  toggleDropdown(e) {
    e.stopPropagation();
    if (this.loading || this.users.length === 0) return;
    
    this.abierto = !this.abierto;
    
    if (this.abierto && this.filtro === '') {
      // Mostrar lista completa al abrir
      this.filtrados = this.users;
    }
  }

  handleInputClick(e) {
    e.stopPropagation();
    if (!this.abierto && !this.loading && this.users.length > 0) {
      this.abierto = true;
      this.filtrados = this.users;
    }
  }

  actualizarFiltro(e) {
    const valor = e.target.value;
    this.filtro = valor;

    if (valor === '') {
      this.selectedId = '';
      this.medicoSeleccionado = null;
      this.filtrados = this.users;
      this.abierto = true;
      this.dispatchEvent(new CustomEvent('medico-seleccionado', {
        detail: { id: '', nombre: '' },
        bubbles: true,
        composed: true
      }));
    } else {
      const f = valor.toLowerCase();
      this.filtrados = this.users.filter(u =>
        String(u.nombre || '').toLowerCase().includes(f) ||
        String(u.id || '').toLowerCase().includes(f)
      );
      this.abierto = true;
    }
  }

  seleccionarMedico(medico, e) {
    e.stopPropagation();
    this.selectedId = String(medico.id);
    this.medicoSeleccionado = medico;
    this.filtro = `${medico.nombre} (ID: ${medico.id})`;
    this.abierto = false;
    this.filtrados = [];
    
    this.dispatchEvent(new CustomEvent('medico-seleccionado', {
      detail: medico,
      bubbles: true,
      composed: true
    }));
  }

  limpiarSeleccion(e) {
    e.stopPropagation();
    this.filtro = '';
    this.selectedId = '';
    this.medicoSeleccionado = null;
    this.filtrados = this.users;
    this.abierto = true;
    
    this.dispatchEvent(new CustomEvent('medico-seleccionado', {
      detail: { id: '', nombre: '' },
      bubbles: true,
      composed: true
    }));
    
    // Enfocar el input después de limpiar
    setTimeout(() => {
      const input = this.shadowRoot.querySelector('input');
      if (input) input.focus();
    }, 0);
  }

  render() {
    return html`
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          .value=${this.filtro}
          @input=${this.actualizarFiltro}
          @click=${this.handleInputClick}
          placeholder="Buscar médico por nombre o ID..."
          ?disabled=${this.loading}
        />
        
        ${this.filtro && !this.loading ? html`
          <button 
            class="clear-btn" 
            @click=${this.limpiarSeleccion}
            title="Limpiar selección"
          >
            ✕
          </button>
        ` : ''}
        
        <button 
          class="dropdown-btn ${this.abierto ? 'abierto' : ''}" 
          @click=${this.toggleDropdown}
          ?disabled=${this.loading || this.users.length === 0}
          title="${this.abierto ? 'Cerrar lista' : 'Abrir lista'}"
        >
          ▼
        </button>
      </div>

      ${this.loading ? html`
        <div class="loading">Cargando médicos...</div>
      ` : ''}

      ${this.error ? html`
        <div class="error">⚠️ ${this.error}</div>
      ` : ''}

      ${this.abierto && this.filtrados.length > 0 ? html`
        <ul>
          ${this.filtrados.map(medico => html`
            <li 
              class="${String(medico.id) === String(this.selectedId) ? 'selected' : ''}"
              @click=${(e) => this.seleccionarMedico(medico, e)}
            >
              <div class="medico-info">
                <span class="medico-nombre">${medico.nombre}</span>
                <span class="medico-id">ID: ${medico.id}</span>
              </div>
              ${String(medico.id) === String(this.selectedId) ? html`
                <span class="checkmark">✓</span>
              ` : ''}
            </li>
          `)}
        </ul>
      ` : ''}

      ${this.abierto && this.filtrados.length === 0 && this.filtro && !this.loading ? html`
        <ul>
          <li class="empty-state">
            No se encontraron médicos con "${this.filtro}"
          </li>
        </ul>
      ` : ''}

      ${this.medicoSeleccionado && !this.abierto ? html`
        <div class="auto-selected">
          ✓ Médico seleccionado: <strong>${this.medicoSeleccionado.nombre}</strong>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('medico-filtro', MedicoFiltro);