import { useState } from 'react';
import { hotelApi } from '../api/hotelApi';
import { STATUS_LABELS, formatDate, formatDateTime, formatMoney } from '../utils/format';
import InvoiceView from './InvoiceView';

const STEPS = ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'];

export default function ReservationPanel({ reservation, catalog, onUpdate, onError }) {
  const [serviceType, setServiceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (action) => {
    setBusy(true);
    try {
      onUpdate(await action());
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const selectedService = catalog.find((service) => service.type === serviceType);
  const finished = reservation.status === 'CHECKED_OUT';
  const currentStep = STEPS.indexOf(reservation.status);

  return (
    <div className="panel">
      <section className="card panel-main">
        {reservation.room.imageUrl && (
          <img className="panel-photo" src={reservation.room.imageUrl} alt={reservation.room.name} />
        )}
        <div className="panel-header">
          <div>
            <span className="muted small">Código de reserva</span>
            <h2 className="reservation-code">{reservation.id}</h2>
          </div>
          <span className={`badge status-${reservation.status.toLowerCase()}`}>{STATUS_LABELS[reservation.status]}</span>
        </div>

        <ol className="steps">
          {['Reserva confirmada', 'Check-in', 'Check-out'].map((label, index) => (
            <li key={label} className={index <= currentStep ? 'done' : ''}>
              {label}
            </li>
          ))}
        </ol>

        <div className="summary-grid">
          <div>
            <span className="muted small">Huésped</span>
            <p>{reservation.guest.fullName}</p>
            <p className="muted small">
              Doc. {reservation.guest.documentId} · {reservation.guest.email}
              {reservation.guest.phone ? ` · ${reservation.guest.phone}` : ''}
            </p>
          </div>
          <div>
            <span className="muted small">Habitación</span>
            <p>
              {reservation.room.name} · {reservation.room.number}
            </p>
            <p className="muted small">
              {reservation.room.sizeM2} m² · {reservation.room.bedType} · {reservation.numberOfGuests} huésped(es)
            </p>
          </div>
          <div>
            <span className="muted small">Estadía</span>
            <p>
              {formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}
            </p>
            <p className="muted small">{reservation.nights} noche(s)</p>
          </div>
          <div>
            <span className="muted small">Llave digital</span>
            {reservation.digitalKey ? (
              <p className={`key ${finished ? 'revoked' : ''}`} title={finished ? 'Llave desactivada' : 'Llave activa'}>
                🔑 {reservation.digitalKey}
              </p>
            ) : (
              <p className="muted small">Se genera al hacer check-in</p>
            )}
            {reservation.checkedInAt && (
              <p className="muted small">Check-in: {formatDateTime(reservation.checkedInAt)}</p>
            )}
            {reservation.checkedOutAt && (
              <p className="muted small">Check-out: {formatDateTime(reservation.checkedOutAt)} (llave desactivada)</p>
            )}
          </div>
        </div>
      </section>

      <div className="panel-columns">
        <section className="card">
          <h3>Servicios adicionales</h3>
          {reservation.services.length === 0 ? (
            <p className="muted">Aún no hay servicios agregados.</p>
          ) : (
            <ul className="service-list">
              {reservation.services.map((service, index) => (
                <li key={index}>
                  <span>
                    {service.label} × {service.quantity}
                  </span>
                  <span>{formatMoney(service.total)}</span>
                </li>
              ))}
            </ul>
          )}

          {!finished && (
            <form
              className="add-service"
              onSubmit={(event) => {
                event.preventDefault();
                run(() =>
                  hotelApi.addService(reservation.id, serviceType, quantity === '' ? null : Number(quantity)),
                ).then(() => {
                  setServiceType('');
                  setQuantity('');
                });
              }}
            >
              <div className="field">
                <label htmlFor="serviceType">Servicio</label>
                <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
                  <option value="">Selecciona…</option>
                  {catalog.map((service) => (
                    <option key={service.type} value={service.type}>
                      {service.label} — {formatMoney(service.price)}
                      {service.chargedPerDay ? ' por día' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field small-field">
                <label htmlFor="quantity">{selectedService?.chargedPerDay ? 'Días' : 'Cantidad'}</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedService?.chargedPerDay ? reservation.nights : undefined}
                  placeholder={selectedService?.chargedPerDay ? String(reservation.nights) : '1'}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary" disabled={busy || !serviceType}>
                Agregar
              </button>
            </form>
          )}
        </section>

        <section className="card">
          <h3>Resumen</h3>
          <ul className="breakdown">
            <li>
              <span>Alojamiento ({reservation.nights} noche(s))</span>
              <span>{formatMoney(reservation.lodgingCost)}</span>
            </li>
            <li>
              <span>Servicios adicionales</span>
              <span>{formatMoney(reservation.servicesCost)}</span>
            </li>
            <li className="subtotal">
              <span>Total acumulado</span>
              <span>{formatMoney(reservation.currentTotal)}</span>
            </li>
          </ul>
          <div className="actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || reservation.status !== 'CONFIRMED'}
              onClick={() => run(() => hotelApi.checkIn(reservation.id))}
            >
              Hacer check-in
            </button>
            <button
              type="button"
              className="btn btn-gold"
              disabled={busy || reservation.status !== 'CHECKED_IN'}
              onClick={() => run(() => hotelApi.checkOut(reservation.id))}
            >
              Hacer check-out y facturar
            </button>
          </div>
        </section>
      </div>

      {reservation.invoice && <InvoiceView invoice={reservation.invoice} />}
    </div>
  );
}
