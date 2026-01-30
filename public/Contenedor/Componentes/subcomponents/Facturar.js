import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class BotonFacturar extends LitElement {
  static properties = {
    data: { type: Object },
    cargando: { type: Boolean },
    mensaje: { type: String },
    success: { type: Boolean }
  };

  constructor() {
    super();
    this.data = {};
    this.cargando = false;
    this.mensaje = '';
    this.success = false;
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    }

    /* 🧾 CARD */
    .wrapper {
      background: #ffffff;
      border-radius: 14px;
      padding: 22px 24px;
      box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.08),
        0 4px 10px rgba(0, 0, 0, 0.04);
      border: 1px solid #eef1f6;
      max-width: 420px;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: flex-start;
    }

    /* 🔘 BOTÓN */
    button {
      position: relative;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      min-width: 160px;
    }

    button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    button:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    button:hover:not([disabled])::before {
      opacity: 1;
    }

    button:active:not([disabled]) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    button[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* 🔄 SPINNER */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* 💬 MENSAJES */
    .mensaje {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
      max-width: 100%;
      line-height: 1.5;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mensaje.error {
      background: #fee;
      color: #c41e3a;
      border-left: 4px solid #c41e3a;
    }

    .mensaje.ok {
      background: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #4caf50;
    }

    .icono {
      margin-right: 6px;
      font-size: 16px;
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        <div class="container">
          <button @click=${this.facturar} ?disabled=${this.cargando}>
            <span class="button-content">
              ${this.cargando
                ? html`<span class="spinner"></span><span>Facturando...</span>`
                : html`<span>💳 Facturar</span>`
              }
            </span>
          </button>

          ${this.mensaje
            ? html`
                <div class="mensaje ${this.success ? 'ok' : 'error'}">
                  <span class="icono">${this.success ? '✓' : '⚠'}</span>
                  ${this.mensaje}
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }

  async facturar() {
    if (!this.data || typeof this.data !== 'object') {
      this.mensaje = 'No se proporcionó data válida';
      this.success = false;
      return;
    }

    const {
      fk_entidad,
      fk_paciente,
      fk_contrato_entidad,
      procedimientos,
      FacturadorId
    } = this.data;

    if (!fk_entidad || !fk_paciente || !fk_contrato_entidad || !FacturadorId) {
      this.mensaje =
        'Faltan datos obligatorios: entidad, paciente, contrato o facturador';
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
        this.mensaje =
          'Cada procedimiento debe tener procedimiento, valor, médico y servicio';
        this.success = false;
        return;
      }
    }

    this.cargando = true;
    this.mensaje = '';
    this.success = false;

    try {
      const hoy = new Date();
      const format = f =>
        `${String(f.getDate()).padStart(2, '0')}/${String(
          f.getMonth() + 1
        ).padStart(2, '0')}/${f.getFullYear()}`;

      const payload = {
        ...this.data,
        fecha_admision: this.data.fecha_admision || format(hoy),
        fecha_remision: this.data.fecha_remision || format(hoy),
        fecha_emision: this.data.fecha_emision || format(hoy)
      };

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
