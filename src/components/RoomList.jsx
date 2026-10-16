import { formatMoney } from '../utils/format';

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
              <div className="room-photo">
                <img src={room.imageUrl} alt={`${room.name}, habitación ${room.number}`} loading="lazy" />
                <span className={`badge ${room.available ? 'badge-ok' : 'badge-busy'}`}>
                  {room.available ? 'Disponible' : 'No disponible'}
                </span>
                <span className="room-tag">{room.typeLabel}</span>
              </div>
              <div className="room-body">
                <div className="room-top">
                  <span className="room-type">{room.name}</span>
                  <span className="room-number">Hab. {room.number}</span>
                </div>
                <p className="room-desc">{room.description}</p>
                <ul className="room-facts">
                  <li>📐 {room.sizeM2} m²</li>
                  <li>🛏️ {room.bedType}</li>
                  <li>🌅 Vista {room.view.toLowerCase()}</li>
                  <li>👤 Hasta {room.capacity}</li>
                  <li>🏢 Piso {room.floor}</li>
                </ul>
                <ul className="amenities">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                  {room.amenities.length > 4 && <li>+{room.amenities.length - 4} más</li>}
                </ul>
                <div className="room-price">
                  <div>
                    <strong>{formatMoney(room.quote.averageNightlyPrice)}</strong>
                    <span className="muted"> / noche</span>
                  </div>
                  <span className="muted small">
                    Total {formatMoney(room.quote.total)} · {room.quote.nights} noche(s)
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
