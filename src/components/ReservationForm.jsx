import { useState } from 'react';

const EMPTY_GUEST = { guestName: '', documentId: '', email: '', phone: '', numberOfGuests: 1 };

export default function ReservationForm({ room, onSubmit, submitting }) {
  const [guest, setGuest] = useState(EMPTY_GUEST);

  if (!room) return null;

  const update = (field) => (event) => setGuest({ ...guest, [field]: event.target.value });

  return (
    <form
      className="card reservation-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...guest, numberOfGuests: Number(guest.numberOfGuests) });
      }}
    >
      <h3>Datos del huésped</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="guestName">Nombre completo</label>
          <input id="guestName" value={guest.guestName} onChange={update('guestName')} required />
        </div>
        <div className="field">
          <label htmlFor="documentId">Documento de identidad</label>
          <input id="documentId" value={guest.documentId} onChange={update('documentId')} required />
        </div>
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" value={guest.email} onChange={update('email')} required />
        </div>
        <div className="field">
          <label htmlFor="phone">Teléfono</label>
          <input id="phone" type="tel" value={guest.phone} onChange={update('phone')} />
        </div>
        <div className="field">
          <label htmlFor="numberOfGuests">Número de huéspedes</label>
          <input
            id="numberOfGuests"
            type="number"
            min="1"
            max={room.capacity}
            value={guest.numberOfGuests}
            onChange={update('numberOfGuests')}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Reservando…' : `Confirmar reserva de la habitación ${room.number}`}
      </button>
    </form>
  );
}
