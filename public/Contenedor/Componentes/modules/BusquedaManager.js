import { Utils } from './utils.js';

export class BusquedaManager {
  constructor(component) {
    this.component = component;
  }

  getConfigBusqueda() {
    return {
      admision: {
        label: 'Número de Admisión',
        placeholder: 'Ej: 123456',
        endpoint: '/roberto/jsoncompleto',
        paramName: 'numeroDocumento'
      },
      documento: {
        label: 'Documento del Paciente',
        placeholder: 'Ej: 123456789',
        endpoint: '/roberto/BuscarPacienteAdmicion',
        paramName: 'documentoPaciente'
      }
    };
  }

  getValorBusqueda() {
    const { tipoBusqueda } = this.component;
    return tipoBusqueda === 'admision' 
      ? this.component.numeroAdmision 
      : this.component.documentoPaciente;
  }

  getConfigActual() {
    const { tipoBusqueda } = this.component;
    return this.getConfigBusqueda()[tipoBusqueda];
  }

  async buscar() {
    const valor = this.getValorBusqueda();
    const config = this.getConfigActual();
    
    if (!valor) {
      throw new Error(`Debe ingresar un ${config.label.toLowerCase()}`);
    }

    try {
      const resp = await fetch(`${config.endpoint}?${config.paramName}=${encodeURIComponent(valor)}`);
      if (!resp.ok) throw new Error('Error en la respuesta del servidor');
      return await resp.json();
    } catch (error) {
      throw new Error(`Error en la búsqueda: ${error.message}`);
    }
  }

  procesarResultadoBusqueda(json) {
    const { tipoBusqueda } = this.component;
    
    if (!json.ok && tipoBusqueda === 'admision') {
      throw new Error('No se pudo consultar la admisión');
    }

    this.component.data = json;

    if (tipoBusqueda === 'documento' && json.id_paciente) {
      return this.procesarPacienteDocumento(json);
    } else if (tipoBusqueda === 'admision' && json.ok) {
      return this.procesarAdmision(json);
    }
  }

  procesarPacienteDocumento(paciente) {
    return {
      fk_paciente: paciente.id_paciente,
      fk_entidad: paciente.fk_entidad || '',
      documento_paciente: paciente.documento_paciente,
      nombre1_paciente: paciente.nombre1_paciente,
      nombre2_paciente: paciente.nombre2_paciente,
      apellido1_paciente: paciente.apellido1_paciente,
      apellido2_paciente: paciente.apellido2_paciente,
      fecha_nacimiento: paciente.fecha_nacimiento
    };
  }

  procesarAdmision(admision) {
    return {
      item: admision.resultadoCompleto?.[0],
      paciente: admision.resultadoCompleto?.[0]?.paciente,
      historia: admision.resultadoCompleto?.[0]?.historia
    };
  }
}