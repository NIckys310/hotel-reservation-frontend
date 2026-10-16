import { useCallback, useEffect, useState } from 'react';
import { hotelApi } from './api/hotelApi';
import SearchForm from './components/SearchForm';
import RoomList from './components/RoomList';
import PricePreview from './components/PricePreview';
import ReservationForm from './components/ReservationForm';
import ReservationPanel from './components/ReservationPanel';
import { STATUS_LABELS, addDays, formatDate, toIsoDate } from './utils/format';

const today = toIsoDate(new Date());

export default function App() {
  const [tab, setTab] = useState('book');
  const [search, setSearch] = useState({ checkIn: today, checkOut: addDays(today, 2), type: '' });
  const [rooms, setRooms] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [lookupCode, setLookupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    hotelApi.getServiceCatalog().then(setCatalog).catch((e) => setError(e.message));
  }, []);

  const refreshReservations = useCallback(() => {
    hotelApi.getReservations().then(setReservations).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'manage') refreshReservations();
  }, [tab, refreshReservations]);

  const runSearch = async () => {
    setLoading(true);
    setError('');
    setNotice('');
    setSelectedRoom(null);
    try {
      setRooms(await hotelApi.checkAvailability(search.checkIn, search.checkOut, search.type));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (type) =>
    setSelectedServices((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );

  const createReservation = async (guest) => {
    setLoading(true);
    setError('');
    try {
      let created = await hotelApi.createReservation({
        ...guest,
        roomNumber: selectedRoom.number,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
      });
      for (const type of selectedServices) {
        created = await hotelApi.addService(created.id, type, null);
      }
      setReservation(created);
      setNotice(`¡Reserva creada! Guarda tu código: ${created.id}`);
      setSelectedRoom(null);
      setSelectedServices([]);
      setRooms(null);
      setTab('manage');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReservation = async (code) => {
    if (!code.trim()) return;
    setError('');
    setNotice('');
    try {
      setReservation(await hotelApi.getReservation(code.trim()));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUpdate = (updated) => {
    setError('');
    setReservation(updated);
    refreshReservations();
  };

  return (
    <>
      <header className="hero">
        <div className="container">
          <p className="eyebrow">Hotel Fachada · Reservas en línea</p>
          <h1>Sistema de Reservas de Hotel</h1>
          <p className="lead">
            Busca habitaciones por fecha, reserva en minutos y gestiona tu estadía: servicios, check-in, check-out y
            factura.
          </p>
          <nav className="tabs" aria-label="Secciones">
            <button type="button" className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}>
              Reservar habitación
            </button>
            <button type="button" className={tab === 'manage' ? 'active' : ''} onClick={() => setTab('manage')}>
              Gestionar reserva
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
            <button type="button" aria-label="Cerrar" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}
        {notice && (
          <div className="alert alert-ok" role="status">
            {notice}
            <button type="button" aria-label="Cerrar" onClick={() => setNotice('')}>
              ×
            </button>
          </div>
        )}

        {tab === 'book' && (
          <>
            <SearchForm search={search} onChange={setSearch} onSubmit={runSearch} loading={loading} today={today} />
            <div className="booking-layout">
              <div>
                <RoomList
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onSelect={(room) => {
                    setSelectedRoom(room);
                    setSelectedServices([]);
                  }}
                />
                <ReservationForm
                  key={selectedRoom?.number}
                  room={selectedRoom}
                  onSubmit={createReservation}
                  submitting={loading}
                />
              </div>
              <PricePreview
                room={selectedRoom}
                catalog={catalog}
                selectedServices={selectedServices}
                onToggleService={toggleService}
              />
            </div>
          </>
        )}

        {tab === 'manage' && (
          <div className="manage-layout">
            <aside className="card lookup">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  loadReservation(lookupCode);
                }}
              >
                <label htmlFor="lookup">Buscar por código</label>
                <div className="inline">
                  <input
                    id="lookup"
                    placeholder="RES-XXXXXXXX"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary">
                    Buscar
                  </button>
                </div>
              </form>
              <h3>Reservas recientes</h3>
              {reservations.length === 0 ? (
                <p className="muted small">Todavía no hay reservas.</p>
              ) : (
                <ul className="recent">
                  {reservations.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={reservation?.id === item.id ? 'active' : ''}
                        onClick={() => {
                          setNotice('');
                          setReservation(item);
                        }}
                      >
                        <strong>{item.id}</strong>
                        <span>
                          {item.guest.fullName} · Hab. {item.room.number}
                        </span>
                        <span className="muted small">
                          {formatDate(item.checkInDate)} · {STATUS_LABELS[item.status]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
            <div>
              {reservation ? (
                <ReservationPanel
                  reservation={reservation}
                  catalog={catalog}
                  onUpdate={handleUpdate}
                  onError={setError}
                />
              ) : (
                <p className="empty">Busca una reserva por su código o elige una de la lista.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">Taller Patrón Facade · Sistema de Reservas de Hotel</div>
      </footer>
    </>
  );
}
