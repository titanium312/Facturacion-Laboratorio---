import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

/**
 * Componente profesional para gestión de archivos Excel
 */
@customElement("componente2-app")
export class Componente2App extends LitElement {
  
  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #2d3748;
      max-width: 900px;
      margin: 2rem auto;
      padding: 2.5rem;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid #f0f0f0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #edf2f7;
    }

    h1 {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      color: #1a202c;
      letter-spacing: -0.025em;
    }

    .button-group {
      display: flex;
      gap: 12px;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
    }

    .btn-primary {
      background: #1a202c;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:hover {
      background: #2d3748;
      transform: translateY(-1px);
    }

    .btn-outline {
      background: white;
      border-color: #e2e8f0;
      color: #4a5568;
    }

    .btn-outline:hover {
      background: #f8fafc;
      border-color: #cbd5e0;
    }

    .status-bar {
      margin-top: 1rem;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      animation: fadeIn 0.3s ease;
    }

    .status-success { 
      background: #f0fdf4; 
      color: #166534; 
      border: 1px solid #bbf7d0; 
    }

    .status-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .data-preview {
      margin-top: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    pre {
      margin: 0;
      padding: 1.5rem;
      max-height: 450px;
      overflow: auto;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      background: #fcfcfc;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  @state() datos = null;
  @state() mensaje = "";

  async extraerExcel() {
    try {
      const resultado = await window.marinoAPI.extraerExcel();
      if (resultado) {
        this.datos = resultado;
        this.mensaje = "✓ Archivo cargado correctamente.";
      }
    } catch (error) {
      this.mensaje = "✕ Error al cargar el archivo.";
    }
  }

  async guardarEnCarpeta() {
    if (!this.datos) return;
    
    try {
      // marinoAPI debe gestionar el diálogo nativo de guardar
      const resultado = await window.marinoAPI.guardarExcel(this.datos);
      
      if (resultado.success) {
        this.mensaje = `✓ Guardado en: ${resultado.path}`;
      } else {
        this.mensaje = "Información: El guardado fue cancelado.";
      }
    } catch (error) {
      this.mensaje = "✕ Error al intentar guardar el archivo.";
    }
  }

  render() {
    return html`
      <div class="header">
        <h1>Gestión de Datos</h1>
        <div class="button-group">
          <button class="btn-outline" @click=${this.extraerExcel}>
            📂 Abrir Archivo
          </button>
          
          ${this.datos ? html`
            <button class="btn-primary" @click=${this.guardarEnCarpeta}>
              💾 Guardar como...
            </button>
          ` : ""}
        </div>
      </div>

      ${this.mensaje ? html`
        <div class="status-bar ${this.mensaje.includes('✕') ? 'status-error' : 'status-success'}">
          ${this.mensaje}
        </div>
      ` : ""}

      ${this.datos ? html`
        <div class="data-preview">
          <pre>${JSON.stringify(this.datos, null, 2)}</pre>
        </div>
      ` : html`
        <div class="empty-state">
          <p>No hay datos disponibles para mostrar.</p>
          <small>Seleccione un archivo de Excel para iniciar el procesamiento.</small>
        </div>
      `}
    `;
  }
}