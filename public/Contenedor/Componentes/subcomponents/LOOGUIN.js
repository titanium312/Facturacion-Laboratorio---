import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class LoginComponent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 9999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* ===== Overlay ===== */
    .overlay {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }

    /* ===== Ventana principal ===== */
    .card {
      width: 100%;
      max-width: 440px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 28px;
      box-shadow: 
        0 50px 100px rgba(0, 0, 0, 0.3),
        0 20px 60px rgba(102, 126, 234, 0.4);
      overflow: hidden;
      animation: floatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(20px);
    }

    @keyframes floatIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* ===== Header con gradiente mejorado ===== */
    .header {
      padding: 48px 32px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 8s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .header h2 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
    }

    .subtitle {
      font-size: 15px;
      opacity: 0.92;
      margin-top: 8px;
      font-weight: 400;
      position: relative;
      z-index: 1;
    }

    /* ===== Body ===== */
    .body {
      padding: 40px 32px;
      background: white;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .input-group {
      position: relative;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      display: block;
      transition: color 0.2s;
    }

    input {
      width: 100%;
      padding: 16px 18px;
      border-radius: 14px;
      border: 2px solid #e5e7eb;
      background: #f9fafb;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 
        0 0 0 4px rgba(102, 126, 234, 0.1),
        0 4px 12px rgba(102, 126, 234, 0.15);
      transform: translateY(-1px);
    }

    input:focus + label {
      color: #667eea;
    }

    /* ===== Botón mejorado ===== */
    button {
      margin-top: 12px;
      padding: 18px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    button:hover::before {
      left: 100%;
    }

    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(102, 126, 234, 0.5);
    }

    button:active {
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    button:disabled:hover {
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    /* ===== Mensajes mejorados ===== */
    .message {
      margin-top: 24px;
      padding: 16px 18px;
      border-radius: 14px;
      font-size: 15px;
      animation: slideIn 0.3s ease;
      font-weight: 500;
    }

    .error {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
      border-left: 5px solid #dc2626;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
    }

    .success {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
      border-left: 5px solid #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }

    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(-12px); 
      }
      to { 
        opacity: 1; 
        transform: translateY( 0); 
      }
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 480px) {
      .overlay {
        padding: 16px;
      }

      .card {
        max-width: 100%;
        border-radius: 24px;
      }

      .header {
        padding: 36px 24px 32px;
      }

      .header h2 {
        font-size: 28px;
      }

      .subtitle {
        font-size: 14px;
      }

      .body {
        padding: 32px 24px;
      }

      input {
        padding: 14px 16px;
        font-size: 15px;
      }

      button {
        padding: 16px;
        font-size: 16px;
      }
    }

    @media (max-width: 360px) {
      .header h2 {
        font-size: 24px;
      }

      .body {
        padding: 24px 20px;
      }

      form {
        gap: 20px;
      }
    }

    /* ===== Modo landscape en móviles ===== */
    @media (max-height: 600px) and (orientation: landscape) {
      .overlay {
        padding: 12px;
        overflow-y: auto;
      }

      .card {
        margin: auto;
      }

      .header {
        padding: 24px 24px 20px;
      }

      .header h2 {
        font-size: 24px;
      }

      .body {
        padding: 24px;
      }

      form {
        gap: 16px;
      }
    }
  `;

  static properties = {
    username: { type: String },
    password: { type: String },
    loading: { type: Boolean },
    message: { type: String },
    error: { type: Boolean }
  };

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.loading = false;
    this.message = '';
    this.error = false;
  }

  async handleLogin(e) {
    e.preventDefault();

    if (!this.username || !this.password) {
      this.message = 'Please fill in both fields';
      this.error = true;
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = false;

    try {
      const response = await fetch('https://api.saludplus.co/api/auth/Login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userInfo = {
        idFacturador: data.id,
        nombre: data.nombre
      };

      this.dispatchEvent(new CustomEvent('login-success', {
        detail: userInfo,
        bubbles: true,
        composed: true
      }));

      this.message = 'Login successful!';
      this.error = false;

    } catch (err) {
      this.message = err.message || 'An error occurred during login';
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="overlay">
        <div class="card">
          <div class="header">
            <h2>Login</h2>
            <div class="subtitle">Acceso seguro al sistema</div>
          </div>

          <div class="body">
            <form @submit=${this.handleLogin}>
              <div class="input-group">
                <label>Username</label>
                <input
                  type="text"
                  .value=${this.username}
                  @input=${e => this.username = e.target.value}
                  placeholder="Enter your username"
                  required
                >
              </div>

              <div class="input-group">
                <label>Password</label>
                <input
                  type="password"
                  .value=${this.password}
                  @input=${e => this.password = e.target.value}
                  placeholder="Enter your password"
                  required
                >
              </div>

              <button type="submit" ?disabled=${this.loading}>
                ${this.loading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            ${this.message ? html`
              <div class="message ${this.error ? 'error' : 'success'}">
                ${this.message}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-component', LoginComponent);