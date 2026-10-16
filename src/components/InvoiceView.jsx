import { formatDateTime, formatMoney } from '../utils/format';

export default function InvoiceView({ invoice }) {
  return (
    <section className="card invoice" aria-label="Factura final">
      <header className="invoice-header">
        <div>
          <h3>Factura {invoice.invoiceNumber}</h3>
          <p className="muted small">Emitida el {formatDateTime(invoice.issuedAt)}</p>
        </div>
        <button type="button" className="btn btn-ghost no-print" onClick={() => window.print()}>
          Imprimir
        </button>
      </header>

      <div className="invoice-info">
        <div>
          <span className="muted small">Huésped</span>
          <p>{invoice.guest.fullName}</p>
          <p className="muted small">
            Doc. {invoice.guest.documentId} · {invoice.guest.email}
          </p>
        </div>
        <div>
          <span className="muted small">Reserva</span>
          <p>{invoice.reservationId}</p>
          <p className="muted small">
            Habitación {invoice.roomNumber} · {invoice.nights} noche(s)
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th className="num">Cant.</th>
              <th className="num">Valor unitario</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, index) => (
              <tr key={index}>
                <td>{line.concept}</td>
                <td className="num">{line.quantity}</td>
                <td className="num">{formatMoney(line.unitPrice)}</td>
                <td className="num">{formatMoney(line.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="totals">
        <div>
          <dt>Subtotal alojamiento</dt>
          <dd>{formatMoney(invoice.lodgingSubtotal)}</dd>
        </div>
        <div>
          <dt>Subtotal servicios adicionales</dt>
          <dd>{formatMoney(invoice.servicesSubtotal)}</dd>
        </div>
        <div className="grand-total">
          <dt>Total a pagar</dt>
          <dd>{formatMoney(invoice.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
