import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';
import "./Componentes/BuscadorPaciente.js";

class MiPrincipal extends LitElement {

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      
      /* Fondo elegante con degradado suave y sutil */
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #1e293b;
      
      /* Centrado del contenido principal */
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px;
    }

    .contenedor {
      width: 100%;
      margin: 0; /* Sin márgenes externos innecesarios */
      padding: 32px;
      
      /* Tarjeta flotante con efecto cristal / sombra elegante */
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(226, 232, 240, 0.8);
      
      text-align: center; /* Alineación y centrado del texto */
    }

    h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.025em;
    }

    p {
      margin: 0 0 28px 0;
      font-size: 1rem;
      color: #64748b;
    }

    buscador-paciente {
      text-align: left; /* Restaura alineación a la izquierda para el buscador si es necesario */
      display: block;
    }
  `;

  render() {
    return html`
      <div class="contenedor">
        <h1>Laboratorio Clínico</h1>
        <p>Gestión y búsqueda de pacientes</p>

        <buscador-paciente></buscador-paciente>
      </div>
    `;
  }
}

customElements.define("mi-principal", MiPrincipal);