import { html } from 'https://unpkg.com/lit@2.7.5?module';
import { Utils } from './utils.js';

export class UIComponents {
  static renderDatosPaciente(paciente) {
    return Object.entries(paciente).map(
      ([k, v]) => html`
        <div class="row">
          <span class="label">${Utils.formatKey(k)}:</span>
          <span class="value">${Utils.formatValue(k, v)}</span>
        </div>`
    );
  }

  static renderTablaProcedimientos(lista, context) {
    if (!lista || lista.length === 0) {
      return html`<div class="row">No hay procedimientos registrados</div>`;
    }

    return html`
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>ID Procedimiento</th>
            <th>CUP</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${lista.map(p => this.renderFilaProcedimiento(p, context))}
        </tbody>
      </table>
    `;
  }

  static renderFilaProcedimiento(p, context) {
    const valor = context.valoresProcedimientos[p.fk_procedimiento] ?? 0;
    const metodoEliminar = context.tipoBusqueda === 'admision' 
      ? () => context.eliminarProcedimiento(p.fk_procedimiento)
      : () => context.eliminarProcedimientoPorDocumento(p.fk_procedimiento);

    return html`
      <tr>
        <td>${p.tipo ?? ''}</td>
        <td>${p.cantidad ?? 1}</td>
        <td>${p.fk_procedimiento ?? ''}</td>
        <td>${p.cup ?? ''}</td>
        <td>${p.nombreProcedimiento ?? ''}</td>
        <td>${context.contratoSeleccionado ? `$${valor.toLocaleString()}` : 'Sin contrato'}</td>
        <td>
          <div class="procedimiento-actions">
            <button @click=${metodoEliminar}>
              ❌ Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  static renderTotal(lista, valoresProcedimientos, contratoSeleccionado) {
    let total = 0;
    for (const p of lista) {
      const valor = valoresProcedimientos[p.fk_procedimiento] || 0;
      total += valor * (p.cantidad || 1);
    }

    if (!contratoSeleccionado) return '';

    return html`
      <div class="total-factura">
        <strong>Total Factura:</strong> $${total.toLocaleString()}
      </div>
    `;
  }
}