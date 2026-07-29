import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.5?module';
import './subcomponents/SelectorContrato.js';
import './subcomponents/MedicoFiltro.js';
import './subcomponents/LaboratorioProcedimientos.js';
import './subcomponents/ListaEntidades.js'; 
import './subcomponents/Facturar.js';
import './subcomponents/LOOGUIN.js';

import { BusquedaManager } from './modules/BusquedaManager.js';
import { FacturacionManager } from './modules/FacturacionManager.js';
import { UIComponents } from './modules/UIComponents.js';
import { Utils } from './modules/utils.js';

import style from './BuscadorPacienteStyles.js';


class BuscadorPaciente extends LitElement {
  static properties = {
    // 🔹 Búsqueda
    numeroAdmision: { type: String },
    documentoPaciente: { type: String },
    tipoBusqueda: { type: String },
    
    // 🔹 Resultados
    data: { type: Object },
    cargando: { type: Boolean },
    error: { type: String },
    
    // 🔹 Facturación
    contratoSeleccionado: { type: String },
    valoresProcedimientos: { type: Object },
    fkUsuario: { type: String },
    fkUsuarioHistoria: { type: String },
    procedimientosAgregados: { type: Array },
    facturaData: { type: Object },
    facturadorId: { type: Number },
    facturadorNombre: { type: String },
    
    // 🔹 Para búsqueda por documento
    pacienteDocumentoEncontrado: { type: Object },
    mostrarFormularioFacturacion: { type: Boolean },
    admisionManual: { type: String },
    cargandoValores: { type: Boolean }
  };

  constructor() {
    super();
    this.busquedaManager = new BusquedaManager(this);
    this.facturacionManager = new FacturacionManager(this);
    this.resetearEstadoCompleto();
  }

  static styles = style;

  resetearEstadoCompleto() {
    // 🔹 Búsqueda
    this.numeroAdmision = '';
    this.documentoPaciente = '';
    this.tipoBusqueda = 'admision';
    
    // 🔹 Resultados
    this.data = null;
    this.cargando = false;
    this.error = '';
    
    // 🔹 Facturación
    this.contratoSeleccionado = '';
    this.valoresProcedimientos = {};
    this.fkUsuario = '';
    this.fkUsuarioHistoria = '';
    this.procedimientosAgregados = [];
    this.facturaData = null;
    
    // 🔹 Para búsqueda por documento
    this.pacienteDocumentoEncontrado = null;
    this.mostrarFormularioFacturacion = false;
    this.admisionManual = '';
    this.cargandoValores = false;
  }

  render() {
    if (!this.facturadorId) {
      return this.renderLogin();
    }

    return html`
      <div class="card">
        <div class="facturador-info">
          <strong>Facturador:</strong> ${this.facturadorNombre} (ID: ${this.facturadorId})
        </div>

        ${this.renderBuscador()}
        ${this.renderContenido()}
      </div>
    `;
  }

  renderLogin() {
    return html`
      <div class="card">
        <h3>🔐 Login de Facturador</h3>
        <login-component @login-success=${this.onLoginSuccess}></login-component>
      </div>
    `;
  }

  renderBuscador() {
    const config = this.busquedaManager.getConfigActual();
    
    return html`
      <div class="busqueda-container">
        <h3>🔍 Búsqueda de Paciente</h3>
        
        <div class="tipo-busqueda">
          <label>
            <input 
              type="radio" 
              name="tipoBusqueda" 
              value="admision" 
              ?checked=${this.tipoBusqueda === 'admision'}
              @change=${this.cambiarTipoBusqueda}
            />
            <span>Por Número de Admisión</span>
          </label>
          
          <label>
            <input 
              type="radio" 
              name="tipoBusqueda" 
              value="documento" 
              ?checked=${this.tipoBusqueda === 'documento'}
              @change=${this.cambiarTipoBusqueda}
            />
            <span>Por Documento del Paciente</span>
          </label>
        </div>

        <div class="input-group">
          <label>${config.label}:</label>
          <input
            type="text"
            placeholder="${config.placeholder}"
            .value=${this.busquedaManager.getValorBusqueda()}
            @input=${this.handleInputBusqueda}
            @keypress=${this.handleKeyPressBusqueda}
          />
        </div>

        <button @click=${this.buscar} ?disabled=${this.cargando || !this.busquedaManager.getValorBusqueda()}>
          ${this.cargando ? '🔍 Buscando...' : '🔍 Buscar Paciente'}
        </button>

        ${this.error ? html`<div class="error">❌ ${this.error}</div>` : ''}
        ${this.data?.mensaje ? html`<div class="success">✅ ${this.data.mensaje}</div>` : ''}
      </div>
    `;
  }

  renderContenido() {
    if (!this.data) return '';

    if (this.tipoBusqueda === 'admision') {
      return html`
        ${this.renderResultadoAdmision()}
        ${this.facturaData ? html`<boton-facturar .data=${this.facturaData}></boton-facturar>` : ''}
      `;
    } else {
      return html`
        ${this.renderResultadoDocumento()}
        ${this.renderFormularioFacturacionPorDocumento()}
        ${this.facturaData ? html`<boton-facturar .data=${this.facturaData}></boton-facturar>` : ''}
      `;
    }
  }

  // ----------------------------
  // 🔹 Métodos de UI simplificados
  // ----------------------------
  cambiarTipoBusqueda = (e) => {
    const nuevoTipo = e.target.value;
    if (nuevoTipo === this.tipoBusqueda) return;
    
    this.tipoBusqueda = nuevoTipo;
    this.resetearEstadoFacturacion();
    this.pacienteDocumentoEncontrado = null;
    this.mostrarFormularioFacturacion = false;
  };

  handleInputBusqueda = (e) => {
    if (this.tipoBusqueda === 'admision') {
      this.numeroAdmision = e.target.value;
    } else {
      this.documentoPaciente = e.target.value;
    }
  };

  handleKeyPressBusqueda = (e) => {
    if (e.key === 'Enter') this.buscar();
  };

  // ----------------------------
  // 🔹 Métodos de búsqueda simplificados
  // ----------------------------
  async buscar() {
    this.cargando = true;
    this.error = '';
    this.data = null;
    this.resetearEstadoFacturacion();
    this.pacienteDocumentoEncontrado = null;
    this.mostrarFormularioFacturacion = false;

    try {
      const json = await this.busquedaManager.buscar();
      this.pacienteDocumentoEncontrado = this.busquedaManager.procesarResultadoBusqueda(json);
    } catch (error) {
      this.error = error.message;
    } finally {
      this.cargando = false;
    }
  }

  // ----------------------------
  // 🔹 Renderizado de resultados
  // ----------------------------
  renderResultadoAdmision() {
    const item = this.data?.resultadoCompleto?.[0];
    if (!item) return html`<div class="error">No se encontraron datos para esta admisión</div>`;

    const { paciente, historia } = item;

    if (!this.fkUsuarioHistoria) {
      this.fkUsuarioHistoria = historia.fk_usuario || '';
      this.fkUsuario = this.fkUsuarioHistoria;
    }

    const procedimientosValidos = this.obtenerProcedimientosValidos(historia);

    return html`
      <div class="section">
        <h4>📊 Información de Admisión</h4>
        <div class="row"><span class="label">Estado:</span> <span class="value">✅ ${this.data.ok ? 'Encontrado' : 'No encontrado'}</span></div>
        <div class="row"><span class="label">Número consultado:</span> <span class="value">${this.data.numeroDocumento}</span></div>
        <div class="row"><span class="label">Fecha consulta:</span> <span class="value">${this.data.fechaConsulta}</span></div>
      </div>

      <div class="section">
        <h4>👤 Información del Paciente</h4>
        ${UIComponents.renderDatosPaciente(paciente)}
      </div>

      ${this.renderHistoriaYProcedimientos(historia, procedimientosValidos)}
    `;
  }

  renderResultadoDocumento() {
    if (this.pacienteDocumentoEncontrado && this.mostrarFormularioFacturacion) {
      return html`
        <div class="section">
          <h4>✅ Paciente Encontrado</h4>
          <p>Paciente encontrado con el documento ${this.documentoPaciente}. Puede proceder a facturar directamente.</p>
        </div>

        <div class="section">
          <h4>👤 Información del Paciente</h4>
          ${UIComponents.renderDatosPaciente(this.pacienteDocumentoEncontrado)}
        </div>
      `;
    }

    if (!this.data || !this.data.id_paciente) {
      return html`
        <div class="error">
          No se encontró paciente con documento ${this.documentoPaciente}
        </div>
      `;
    }

    return html`
      <div class="section">
        <h4>✅ Paciente Encontrado</h4>
        <p>Se encontró un paciente con el documento proporcionado.</p>
        
        <button 
          @click=${this.iniciarFacturacionPorDocumento}
          style="margin-top: 15px; background: #4caf50;"
        >
          🧾 Iniciar Facturación
        </button>
      </div>

      <div class="section">
        <h4>👤 Información del Paciente</h4>
        ${UIComponents.renderDatosPaciente(this.data)}
      </div>
    `;
  }

  renderFormularioFacturacionPorDocumento() {
    if (!this.mostrarFormularioFacturacion || !this.pacienteDocumentoEncontrado) return '';

    const procedimientosValidos = this.procedimientosAgregados;

    return html`
      <div class="formulario-facturacion">
        <h4>🧾 Facturación Directa por Documento</h4>
        
        <div class="form-row">
          <span class="form-label">Número de Admisión:</span>
          <input 
            type="text" 
            class="form-input"
            placeholder="Ingrese número de admisión manual"
            .value=${this.admisionManual}
            @input=${e => this.admisionManual = e.target.value}
          />
        </div>

        <div class="section">
          <h4>🏥 Entidad y Contrato</h4>
          
          <lista-entidades
            .fk_entidad=${this.pacienteDocumentoEncontrado?.fk_entidad || ''}
            @entidad-seleccionada=${this.onEntidadSeleccionadaPorDocumento}>
          </lista-entidades>
          
          ${this.pacienteDocumentoEncontrado?.fk_entidad ? html`
            <selector-contrato
              identidad="${this.pacienteDocumentoEncontrado.fk_entidad}"
              fechaemision="${Utils.getFechaActualISO()}"
              @contrato-seleccionado=${this.onContratoSeleccionadoPorDocumento}>
            </selector-contrato>
          ` : ''}

          ${this.contratoSeleccionado ? html`
            <medico-filtro
              id-contrato="${this.contratoSeleccionado}"
              @medico-seleccionado=${this.onMedicoSeleccionadoPorDocumento}>
            </medico-filtro>
          ` : ''}
        </div>

        <div class="section">
          <h4>🧪 Procedimientos</h4>
          
          <laboratorio-procedimientos 
            @procedimiento-seleccionado=${this.onProcedimientoAgregadoPorDocumento}>
          </laboratorio-procedimientos>

          ${UIComponents.renderTablaProcedimientos(procedimientosValidos, this)}
          ${UIComponents.renderTotal(procedimientosValidos, this.valoresProcedimientos, this.contratoSeleccionado)}
        </div>

        <div class="section">
          <button 
            @click=${() => this.prepararFacturaPorDocumento(procedimientosValidos)}
            ?disabled=${!this.contratoSeleccionado || procedimientosValidos.length === 0 || this.cargandoValores}
            style="padding: 12px 24px; background: #4caf50;"
          >
            ${this.cargandoValores ? '🔄 Calculando...' : '🧾 Generar Factura'}
          </button>
        </div>
      </div>
    `;
  }

  // ----------------------------
  // 🔹 MÉTODO QUE FALTABA: renderHistoriaYProcedimientos
  // ----------------------------
  renderHistoriaYProcedimientos(historia, procedimientosValidos) {
    // 🔹 Mejora: validar que historia existe
    if (!historia) return html`<div class="error">No hay información de historia clínica</div>`;

    return html`
      <div class="section">
        <h4>📂 Información de la Historia</h4>

        <lista-entidades
          .fk_entidad=${historia.fk_entidad}
          @entidad-seleccionada=${this.onEntidadSeleccionada}>
        </lista-entidades>
        
        <selector-contrato
          identidad="${historia.fk_entidad}"
          fechaemision="${Utils.formatFechaISO(historia.fecha_admision) || Utils.getFechaActualISO()}"
          @contrato-seleccionado=${this.onContratoSeleccionado}>
        </selector-contrato>

        ${this.contratoSeleccionado ? html`
          <div class="row">
            <span class="label">Contrato seleccionado:</span>
            <span class="value">${this.contratoSeleccionado}</span>
          </div>

          <medico-filtro
            id-contrato="${this.contratoSeleccionado}"
            .selectedId=${this.fkUsuarioHistoria}
            @medico-seleccionado=${this.onMedicoSeleccionado}>
          </medico-filtro>
        ` : ''}

        ${this.renderDatosHistoria(historia)}
      </div>

      <div class="section">
        <h4>🧪 Procedimientos</h4>
        
        <laboratorio-procedimientos 
          @procedimiento-seleccionado=${this.onProcedimientoAgregado}>
        </laboratorio-procedimientos>

        ${UIComponents.renderTablaProcedimientos(procedimientosValidos, this)}
        ${UIComponents.renderTotal(procedimientosValidos, this.valoresProcedimientos, this.contratoSeleccionado)}
        
        ${this.contratoSeleccionado ? html`
          <button 
            @click=${() => this.prepararFactura(procedimientosValidos)}
            ?disabled=${procedimientosValidos.length === 0 || this.cargandoValores}
            style="margin-top: 15px; padding: 12px 24px; background: #4caf50;"
          >
            ${this.cargandoValores ? '🔄 Calculando...' : '🧾 Generar Factura'}
          </button>
        ` : ''}
      </div>
    `;
  }

  renderDatosHistoria(historia) {
    return Object.entries(historia).map(([k, v]) => {
      if (k === 'todos_procedimientos' || k === 'conteo_procedimientos') return '';
      if (k === 'fecha_admision') return html`
        <div class="row">
          <span class="label">Fecha de Admisión:</span>
          <span class="value">${Utils.formatFecha(v)}</span>
        </div>`;
      return html`
        <div class="row">
          <span class="label">${Utils.formatKey(k)}:</span>
          <span class="value">${v}</span>
        </div>`;
    });
  }

  // ----------------------------
  // 🔹 Métodos específicos por tipo de búsqueda
  // ----------------------------
  iniciarFacturacionPorDocumento = () => {
    if (!this.data || !this.data.id_paciente) return;
    
    this.pacienteDocumentoEncontrado = {
      fk_paciente: this.data.id_paciente,
      fk_entidad: this.data.fk_entidad || '',
      documento_paciente: this.data.documento_paciente,
      nombre1_paciente: this.data.nombre1_paciente,
      nombre2_paciente: this.data.nombre2_paciente,
      apellido1_paciente: this.data.apellido1_paciente,
      apellido2_paciente: this.data.apellido2_paciente,
      fecha_nacimiento: this.data.fecha_nacimiento
    };
    
    this.mostrarFormularioFacturacion = true;
    this.requestUpdate();
  };

  // ----------------------------
  // 🔹 Métodos de gestión de procedimientos
  // ----------------------------
  obtenerProcedimientosValidos(historia) {
    if (!historia || !historia.todos_procedimientos) return [...this.procedimientosAgregados];
    
    const procedimientosValidosOriginales = historia.todos_procedimientos.filter(
      p => p.nombreProcedimiento !== 'Procedimiento no encontrado'
    );

    return [
      ...procedimientosValidosOriginales,
      ...this.procedimientosAgregados
    ];
  }

  // ----------------------------
  // 🔹 Métodos de event handlers
  // ----------------------------
  onLoginSuccess(e) {
    this.facturadorId = e.detail.idFacturador;
    this.facturadorNombre = e.detail.nombre;
  }

  onEntidadSeleccionada = e => {
    const historia = this.data?.historia;
    if (!historia) return;
    historia.fk_entidad = String(e.detail.fk_entidad);
    this.requestUpdate();
  };

  onEntidadSeleccionadaPorDocumento = e => {
    if (!this.pacienteDocumentoEncontrado) return;
    this.pacienteDocumentoEncontrado.fk_entidad = String(e.detail.fk_entidad);
    this.requestUpdate();
  };

  onContratoSeleccionado = async (e) => {
    this.contratoSeleccionado = e.detail.id_contrato_entidad;
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    this.fkUsuarioHistoria = historia?.fk_usuario || '';
    this.fkUsuario = this.fkUsuarioHistoria;
    this.procedimientosAgregados = [];
    
    // 🔹 Mejora: solo cargar si hay procedimientos
    if (historia?.todos_procedimientos && historia.todos_procedimientos.length > 0) {
      try {
        await this.facturacionManager.cargarValoresProcedimientos(historia.todos_procedimientos);
      } catch (error) {
        console.error('Error al cargar valores de procedimientos:', error);
        this.error = 'Error al cargar valores de procedimientos';
      }
    }
    
    this.requestUpdate();
  };

  onContratoSeleccionadoPorDocumento = async (e) => {
    this.contratoSeleccionado = e.detail.id_contrato_entidad;
    this.procedimientosAgregados = [];
    this.valoresProcedimientos = {}; // 🔹 Reiniciar valores al cambiar contrato
    
    // Si ya hay procedimientos agregados, recargar sus valores con el nuevo contrato
    if (this.procedimientosAgregados.length > 0) {
      try {
        await this.facturacionManager.cargarValoresProcedimientos(this.procedimientosAgregados);
      } catch (error) {
        console.error('Error al cargar valores de procedimientos:', error);
        this.error = 'Error al cargar valores de procedimientos';
      }
    }
    
    this.requestUpdate();
  };

  async onProcedimientoAgregado(e) {
    const p = e.detail;
    const item = this.data?.resultadoCompleto?.[0];
    const historia = item?.historia;
    
    if (!historia) return;
    
    const existe = historia.todos_procedimientos.some(x => x.fk_procedimiento === p.id) ||
                   this.procedimientosAgregados.some(x => x.fk_procedimiento === p.id);
    
    if (existe) return;

    const nuevoProc = {
      fk_procedimiento: p.id,
      cup: p.cups,
      nombreProcedimiento: p.nombre,
      tipo: 'diagnóstico',
      cantidad: 1
    };

    this.procedimientosAgregados = [...this.procedimientosAgregados, nuevoProc];
    
    // 🔹 Cargar valor del nuevo procedimiento
    await this.facturacionManager.cargarValoresProcedimientos([nuevoProc]);
    this.requestUpdate();
  }

  async onProcedimientoAgregadoPorDocumento(e) {
    const p = e.detail;
    
    if (!this.pacienteDocumentoEncontrado) return;
    if (this.procedimientosAgregados.some(x => x.fk_procedimiento === p.id)) return;

    const nuevoProc = {
      fk_procedimiento: p.id,
      cup: p.cups,
      nombreProcedimiento: p.nombre,
      tipo: 'diagnóstico',
      cantidad: 1
    };

    this.procedimientosAgregados = [...this.procedimientosAgregados, nuevoProc];
    
    if (this.contratoSeleccionado) {
      const valor = await this.facturacionManager.cargarValorProcedimiento(p.id);
      this.valoresProcedimientos = {
        ...this.valoresProcedimientos,
        [p.id]: valor
      };
    }
    
    this.requestUpdate();
  }

  onMedicoSeleccionado = e => {
    const nuevo = String(e.detail.id);
    const historia = this.data?.resultadoCompleto?.[0]?.historia;
    if (!historia) return;
    historia.fk_usuario = nuevo;
    this.fkUsuario = nuevo;
    this.fkUsuarioHistoria = nuevo;
  };

  onMedicoSeleccionadoPorDocumento = (e) => {
    this.fkUsuario = String(e.detail.id);
    this.requestUpdate();
  };

  eliminarProcedimiento(id) {
    const item = this.data?.resultadoCompleto?.[0];
    const historia = item?.historia;
    
    if (!historia) return;

    historia.todos_procedimientos = historia.todos_procedimientos.filter(p => p.fk_procedimiento !== id);
    this.procedimientosAgregados = this.procedimientosAgregados.filter(p => p.fk_procedimiento !== id);

    this.requestUpdate();
  }

  eliminarProcedimientoPorDocumento = (id) => {
    this.procedimientosAgregados = this.procedimientosAgregados.filter(p => p.fk_procedimiento !== id);
    const nuevosValores = { ...this.valoresProcedimientos };
    delete nuevosValores[id];
    this.valoresProcedimientos = nuevosValores;
    this.requestUpdate();
  };

  // ----------------------------
  // 🔹 Métodos de preparación de factura
  // ----------------------------
  prepararFactura(listaProcedimientos) {
    try {
      this.cargandoValores = true;
      this.facturaData = this.facturacionManager.prepararFacturaAdmision(listaProcedimientos);
      console.log('Datos para facturación por admisión:', this.facturaData);
      this.requestUpdate();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.cargandoValores = false;
    }
  }

  prepararFacturaPorDocumento = async (listaProcedimientos) => {
    try {
      this.facturacionManager.validarDatosFacturacionDocumento();
      
      this.cargandoValores = true;
      this.requestUpdate();
      
      await this.facturacionManager.cargarValoresProcedimientos(listaProcedimientos);
      
      this.facturaData = this.facturacionManager.prepararFacturaDocumento(listaProcedimientos);
      console.log('Datos para facturación por documento:', this.facturaData);
      
      this.requestUpdate();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.cargandoValores = false;
    }
  };

  resetearEstadoFacturacion() {
    this.contratoSeleccionado = '';
    this.valoresProcedimientos = {};
    this.fkUsuario = '';
    this.fkUsuarioHistoria = '';
    this.procedimientosAgregados = [];
    this.facturaData = null;
    this.admisionManual = '';
    this.cargandoValores = false;
  }
}

customElements.define('buscador-paciente', BuscadorPaciente);