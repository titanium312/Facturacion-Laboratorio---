// BuscadorPacienteStyles.js
import { css } from 'lit';

export default css`
  :host {
    display: block;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #333;
    --primary-color: #4361ee;
    --secondary-color: #3a0ca3;
    --success-color: #4cc9f0;
    --warning-color: #f72585;
    --light-bg: #f8f9fa;
    --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    --border-radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    box-sizing: border-box;
  }

  .card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
    padding: 2rem;
    margin: 1rem auto;
    max-width: 1200px;
    transition: var(--transition);
  }

  .facturador-info {
    background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 15px rgba(67, 97, 238, 0.2);
  }

  .facturador-info::before {
    content: "👤";
    font-size: 1.2rem;
  }

  h3 {
    color: var(--secondary-color);
    margin: 0 0 1.5rem 0;
    font-size: 1.8rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.8rem;
  }

  h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--success-color));
    border-radius: 2px;
  }

  h4 {
    color: #2d3748;
    margin: 1.5rem 0 1rem 0;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h4::before {
    font-size: 1.2rem;
  }

  /* 🔍 Buscador */
  .busqueda-container {
    background: var(--light-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
    border: 1px solid #e9ecef;
  }

  .tipo-busqueda {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e9ecef;
  }

  .tipo-busqueda label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #495057;
    transition: var(--transition);
    padding: 8px 16px;
    border-radius: 8px;
  }

  .tipo-busqueda label:hover {
    background: rgba(67, 97, 238, 0.05);
    color: var(--primary-color);
  }

  .tipo-busqueda input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #495057;
    font-size: 1rem;
  }

  .input-group input {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: var(--transition);
    background: white;
  }

  .input-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }

  .input-group input::placeholder {
    color: #a0aec0;
  }

  button {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.25);
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 97, 238, 0.35);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  /* 📊 Resultados */
  .section {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: var(--border-radius);
    padding: 1.8rem;
    margin-bottom: 1.5rem;
    transition: var(--transition);
  }

  .section:hover {
    border-color: var(--primary-color);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  .row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f9;
    align-items: center;
  }

  .row:last-child {
    border-bottom: none;
  }

  .row:hover {
    background: #f8fafc;
    border-radius: 6px;
  }

  .label {
    font-weight: 600;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label::before {
    content: "•";
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  .value {
    color: #2d3748;
    font-weight: 500;
    word-break: break-word;
  }

  /* ✅❌ Mensajes */
  .error {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin: 1rem 0;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
  }

  .error::before {
    content: "⚠️";
    font-size: 1.2rem;
  }

  .success {
    background: linear-gradient(135deg, #51cf66 0%, #2f9e44 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin: 1rem 0;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
  }

  .success::before {
    content: "✅";
    font-size: 1.2rem;
  }

  /* 🧾 Formulario Facturación */
  .formulario-facturacion {
    background: #f8fafc;
    border-radius: var(--border-radius);
    padding: 2rem;
    border: 2px dashed #cbd5e0;
    margin-top: 2rem;
  }

  .form-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-label {
    font-weight: 600;
    color: #4a5568;
    min-width: 180px;
  }

  .form-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: var(--transition);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }

  /* 🧪 Tabla Procedimientos */
  .procedimientos-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5rem 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .procedimientos-table th {
    background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
    color: white;
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .procedimientos-table td {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    background: white;
  }

  .procedimientos-table tr:last-child td {
    border-bottom: none;
  }

  .procedimientos-table tr:hover td {
    background: #f8fafc;
  }

  .btn-eliminar {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition);
  }

  .btn-eliminar:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  /* 📱 Responsive */
  @media (max-width: 768px) {
    .card {
      padding: 1.5rem;
      margin: 0.5rem;
    }

    .row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .tipo-busqueda {
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .procedimientos-table {
      font-size: 0.9rem;
    }

    .procedimientos-table th,
    .procedimientos-table td {
      padding: 0.75rem;
    }

    button {
      width: 100%;
    }
  }

  /* 🎨 Animaciones */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .section {
    animation: fadeIn 0.5s ease-out;
  }

  /* 🔘 Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f3f9;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #3a0ca3 0%, #2a0a8a 100%);
  }
`;