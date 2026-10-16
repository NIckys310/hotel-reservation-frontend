import { formatDate, formatMoney, serviceQuantity } from '../utils/format';

export default function PricePreview({ room, catalog, selectedServices, onToggleService }) {
  if (!room) {
    return (
      <aside className="card preview">
        <h3>Resumen de precio</h3>
        <p className="muted">Selecciona una habitación disponible para ver el precio de tu estadía.</p>
      </aside>
    );
  }

  const { quote } = room;
  const servicesTotal = catalog
    .filter((service) => selectedServices.includes(service.type))
    .reduce((sum, service) => sum + Number(service.price) * serviceQuantity(service, quote.nights), 0);
  const total = Number(quote.total) + servicesTotal;

  return (
    <aside className="card preview">
      <h3>Resumen de precio</h3>
      <p className="preview-room">
        Habitación {room.typeLabel} {room.number}
      </p>
      <p className="muted small">
        {formatDate(quote.checkIn)} → {formatDate(quote.checkOut)} · {quote.nights} noche(s)
      </p>

      <ul className="breakdown">
        {quote.lowSeasonNights > 0 && (
          <li>
            <span>
              {quote.lowSeasonNights} × temporada baja ({formatMoney(quote.basePrice)})
            </span>
            <span>{formatMoney(quote.lowSeasonNights * quote.basePrice)}</span>
          </li>
        )}
        {quote.highSeasonNights > 0 && (
          <li>
            <span>
              {quote.highSeasonNights} × temporada alta ({formatMoney(quote.highSeasonPrice)})
            </span>
            <span>{formatMoney(quote.highSeasonNights * quote.highSeasonPrice)}</span>
          </li>
        )}
        <li className="subtotal">
          <span>Alojamiento</span>
          <span>{formatMoney(quote.total)}</span>
        </li>
      </ul>

      {catalog.length > 0 && (
        <fieldset className="extras">
          <legend>Servicios adicionales (opcionales)</legend>
          {catalog.map((service) => (
            <label key={service.type} className="check">
              <input
                type="checkbox"
                checked={selectedServices.includes(service.type)}
                onChange={() => onToggleService(service.type)}
              />
              <span>
                {service.label} {service.chargedPerDay ? `(${formatMoney(service.price)}/día)` : ''}
              </span>
              <span className="muted">
                {formatMoney(Number(service.price) * serviceQuantity(service, quote.nights))}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="preview-total">
        <span>Total estimado</span>
        <strong>{formatMoney(total)}</strong>
      </div>
      {quote.highSeasonNights > 0 && (
        <p className="hint">Incluye recargo de temporada alta (precio base × 1.5).</p>
      )}
    </aside>
  );
}
