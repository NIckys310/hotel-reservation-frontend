import { formatMoney } from '../utils/format';

const TYPE_ICONS = { SINGLE: '🛏️', DOUBLE: '🛏️🛏️', SUITE: '👑' };

export default function RoomList({ rooms, selectedRoom, onSelect }) {
  if (!rooms) {
    return <p className="empty">Elige tus fechas y pulsa “Buscar disponibilidad” para ver las habitaciones.</p>;
  }
  if (rooms.length === 0) {
    return <p className="empty">No hay habitaciones que coincidan con el tipo y el rango de precio elegidos.</p>;
  }
  const availableCount = rooms.filter((room) => room.available).length;

  return (
    <section>
      <div className="list-header">
        <h2>Habitaciones</h2>
        <span className="muted">
          {availableCount} disponibles de {rooms.length}
        </span>
      </div>
      <div className="room-grid">
        {rooms.map((room) => {
          const selected = selectedRoom?.number === room.number;
          return (
            <button
              type="button"
              key={room.number}
              className={`room-card ${room.available ? '' : 'unavailable'} ${selected ? 'selected' : ''}`}
              disabled={!room.available}
              onClick={() => onSelect(room)}
              aria-pressed={selected}
            >
              <div className="room-top">
                <span className="room-number">Hab. {room.number}</span>
                <span className={`badge ${room.available ? 'badge-ok' : 'badge-busy'}`}>
                  {room.available ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <div className="room-type">
                <span aria-hidden="true">{TYPE_ICONS[room.type]}</span> {room.typeLabel}
              </div>
              <p className="room-desc">{room.description}</p>
              <div className="room-meta">
                <span>Piso {room.floor}</span>
                <span>Hasta {room.capacity} huésped(es)</span>
              </div>
              <div className="room-price">
                <strong>{formatMoney(room.quote.total)}</strong>
                <span className="muted">
                  {' '}
                  · {room.quote.nights} noche(s)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
