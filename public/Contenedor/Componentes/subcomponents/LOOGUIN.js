import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class LoginComponent extends LitElement {
  static properties = {
    email: { type: String },
    password: { type: String },
    error: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.error = '';
    this.loading = false;
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
    }
    .overlay {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      width: 100%; max-width: 400px;
      background: white; border-radius: 28px;
      overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.3);
      animation: slideUp 0.4s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .header {
      padding: 40px; background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; text-align: center;
    }
    .header h1 { margin: 0 0 8px; font-size: 26px; font-weight: 700; }
    .header p  { margin: 0; opacity: 0.85; font-size: 14px; }
    .body { padding: 40px; }
    .field { margin-bottom: 20px; }
    label {
      display: block; font-size: 13px; font-weight: 600;
      color: #374151; margin-bottom: 8px;
    }
    input {
      width: 100%; padding: 12px 16px;
      border: 2px solid #e5e7eb; border-radius: 12px;
      font-size: 15px; font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102,126,234,0.15);
    }
    .error {
      background: #fef2f2; color: #dc2626;
      padding: 10px 14px; border-radius: 10px;
      font-size: 13px; margin-bottom: 16px;
    }
    button {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; border: none; border-radius: 12px;
      font-size: 15px; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102,126,234,0.4);
    }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .footer {
      text-align: center; margin-top: 20px;
      font-size: 13px; color: #6b7280;
    }
    .footer a {
      color: #667eea; text-decoration: none; font-weight: 600;
    }
  `;

  handleInput(e) {
    this[e.target.name] = e.target.value;
    if (this.error) this.error = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    try {
      // Reemplaza con tu llamada real de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1200));

      this.dispatchEvent(new CustomEvent('login-success', {
        detail: { email: this.email },
        bubbles: true,
        composed: true,
      }));
    } catch (err) {
      this.error = 'Credenciales inválidas. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="overlay">
        <div class="card">
          <div class="header">
            <h1>Bienvenido</h1>
            <p>Inicia sesión para continuar</p>
          </div>
          <div class="body">
            ${this.error ? html`<div class="error">${this.error}</div>` : ''}
            <form @submit=${this.handleSubmit}>
              <div class="field">
                <label for="email">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  .value=${this.email}
                  @input=${this.handleInput}
                  placeholder="tu@correo.com"
                  autocomplete="email"
                />
              </div>
              <div class="field">
                <label for="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  .value=${this.password}
                  @input=${this.handleInput}
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
              </div>
              <button type="submit" ?disabled=${this.loading}>
                ${this.loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
            <div class="footer">
              ¿No tienes cuenta? <a href="#">Regístrate</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-component', LoginComponent);
