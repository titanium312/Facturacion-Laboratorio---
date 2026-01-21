// 🔹 LoginComponent actualizado para enviar solo idFacturador y nombre al padre

import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';

class LoginComponent extends LitElement {
  static styles = css`
    /* ...tus estilos actuales... */
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
          'accept': 'application/json',
          'Content-Type': 'application/json',
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

      // 🔹 Tomamos solo idFacturador y nombre
      const userInfo = {
        idFacturador: data.id,
        nombre: data.nombre
      };

      // 🔹 Enviamos al padre
      this.dispatchEvent(new CustomEvent('login-success', {
        detail: userInfo,
        bubbles: true,
        composed: true
      }));

      this.message = 'Login successful!';
      this.error = false;

      console.log('Usuario logueado (para padre):', userInfo);

    } catch (err) {
      this.message = err.message || 'An error occurred during login';
      this.error = true;
      console.error('Login error:', err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <h2>Login</h2>
      
      <form @submit=${this.handleLogin}>
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            type="text"
            .value=${this.username}
            @input=${e => this.username = e.target.value}
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            type="password"
            .value=${this.password}
            @input=${e => this.password = e.target.value}
            required
          >
        </div>

        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      ${this.message ? html`
        <div class=${this.error ? 'error' : 'success'}>
          ${this.message}
        </div>
      ` : ''}
    `;
  }
}

customElements.define('login-component', LoginComponent);
