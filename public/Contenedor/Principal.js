import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';
import "./Componentes/BuscadorPaciente.js";

class MiPrincipal extends LitElement {

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa, #e4ebf5);
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      padding: 40px 20px;
      box-sizing: border-box;
    }

    .contenedor {
      background: #ffffff;
      width: 100%;
      max-width: 720px;
      padding: 32px;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    h1 {
      margin: 0 0 12px 0;
      color: #1976d2;
      font-size: 1.9rem;
      font-weight: 600;
      text-align: center;
    }

    p {
      margin: 0 0 28px 0;
      text-align: center;
      color: #555;
      font-size: 0.95rem;
    }

    buscador-paciente {
      display: block;
      margin-top: 10px;
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
