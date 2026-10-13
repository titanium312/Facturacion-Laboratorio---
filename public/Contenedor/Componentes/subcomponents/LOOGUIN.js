import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class LoginComponent extends LitElement {
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
    }
    .card {
      width: 100%; max-width: 400px;
      background: white; border-radius: 28px;
      overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.3);
    }
    .header {
      padding: 40px; background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; text-align: center;
    }
    .body { padding: 40px; }
    form { display: flex; flex-direction: column; gap: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 14px; font-weight: 600; color: #374151; }
    input {
      width: 100%; padding: 15px; border-radius: 12px;
      border: 2px solid #e5e7eb; box-sizing: border-box;
      font-size: 16px; transition: border-color 0.3s;
    }
    input:focus { outline: none; border-color: #667eea; }
    button {
      margin-top: 10px; padding: 15px; border-radius: 12px; border: none;
      background: #764ba2; color: white; font-weight: bold;
      cursor: pointer; transition: 0.3s; font-size: 16px;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    button:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }

    .error-message {
      margin-top: 15px; padding: 12px; border-radius: 8px;
      background: #fee2e2; color: #b91c1c; font-size: 14px;
      text-align: center; border: 1px solid #fecaca;
    }
  `;

  static properties = {
    username: { type: String },
    password: { type: String },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.loading = false;
    this.error = '';

    // Cambia esto por la URL real de tu backend
    this.apiUrl = 'https://laboratorio-nu.vercel.app/-RB-/login';
  }

  async handleLogin(e) {
    e.preventDefault();
    this.loading = true;
    this.error = '';

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
          // NO pongas 'origin' aquí: el navegador lo agrega solo.
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });

      const data = await response.json();
      console.log('Respuesta login:', data);

      // 👇 Estructura REAL de tu API
      if (data.success && data.usuario) {
        const userInfo = {
          idFacturador: data.usuario.id,
          nombre: data.usuario.nombre,
          iniciales: data.usuario.iniciales,
          email: data.usuario.email,
          usuario: data.usuario.usuario,
          perfiles: data.usuario.perfiles || [],
          // Credenciales de sesión que devuelve la API
          apiToken: data.apiToken,
          apiCookies: data.apiCookies,
          sessionCookie: data.sessionCookie,
          pass: data.pass,
          expiresIn: data.expiresIn
        };

        // Guarda el token para futuras peticiones (opcional pero recomendado)
        localStorage.setItem('apiToken', data.apiToken);
        localStorage.setItem('apiCookies', data.apiCookies);
        localStorage.setItem('sessionCookie', data.sessionCookie);

        this.dispatchEvent(new CustomEvent('login-success', {
          detail: userInfo,
          bubbles: true,
          composed: true
        }));
      } else {
        this.error = data.errorMessage
          || data.message
          || 'Usuario o contraseña incorrectos';
      }
    } catch (err) {
      this.error = 'Error de conexión con el servidor';
      console.error('Login Error:', err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="overlay">
        <div class="card">
          <div class="header">
            <h2>SaludPlus</h2>
            <div class="subtitle">Ingreso de Facturadores</div>
          </div>

          <div class="body">
            <form @submit=${this.handleLogin}>
              <div class="input-group">
                <label>Usuario</label>
                <input
                  type="text"
                  .value=${this.username}
                  @input=${e => this.username = e.target.value}
                  placeholder="Ej: rbarreto"
                  ?disabled=${this.loading}
                  required
                >
              </div>

              <div class="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  .value=${this.password}
                  @input=${e => this.password = e.target.value}
                  placeholder="••••••••"
                  ?disabled=${this.loading}
                  required
                >
              </div>

              <button type="submit" ?disabled=${this.loading}>
                ${this.loading ? 'Validando...' : 'Iniciar Sesión'}
              </button>
            </form>

            ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-component', LoginComponent);
