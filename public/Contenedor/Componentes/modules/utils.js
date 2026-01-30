export class Utils {
  static getFechaActual() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static getFechaActualISO() {
    return new Date().toISOString().split('T')[0];
  }

  static formatFecha(dotNetDate) {
    if (!dotNetDate) return 'N/A';
    const match = /\/Date\((\d+)\)\//.exec(dotNetDate);
    if (!match) return dotNetDate;
    return new Date(Number(match[1])).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatFechaISO(dotNetDate) {
    if (!dotNetDate) return '';
    const match = /\/Date\((\d+)\)\//.exec(dotNetDate);
    if (!match) return '';
    return new Date(Number(match[1])).toISOString().split('T')[0];
  }

  static formatKey(key) {
    const map = {
      'id_paciente': 'ID Paciente',
      'fk_entidad': 'Entidad',
      'documento_paciente': 'Documento',
      'nombre1_paciente': 'Primer Nombre',
      'nombre2_paciente': 'Segundo Nombre',
      'apellido1_paciente': 'Primer Apellido',
      'apellido2_paciente': 'Segundo Apellido',
      'fecha_nacimiento': 'Fecha Nacimiento'
    };
    return map[key] || key.replace(/_/g, ' ').toUpperCase();
  }

  static formatValue(key, value) {
    if (key === 'fecha_nacimiento') {
      return this.formatFecha(value);
    }
    return value || 'No especificado';
  }

  static validateRequired(obj, fields) {
    const missing = fields.filter(field => !obj[field]);
    if (missing.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
    }
    return true;
  }
}