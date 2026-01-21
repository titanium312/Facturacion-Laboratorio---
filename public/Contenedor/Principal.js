import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';
import "./Componentes/BuscadorPaciente.js";

class MiPrincipal extends LitElement {

  static styles = css`
    h1 {
      color: #1976d2;
      font-family: Arial, sans-serif;
    }
  `;

  render() {
    return html`
      <h1>✅ Lit funcionando correctamente</h1>
      <p>Express + TypeScript + Lit</p>

      <buscador-paciente>  </buscador-paciente>
    `;
  }
}

customElements.define("mi-principal", MiPrincipal);
