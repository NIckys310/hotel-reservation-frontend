import { ROOM_TYPES, addDays } from '../utils/format';

export default function SearchForm({ search, onChange, onSubmit, loading, today }) {
  const update = (field) => (event) => {
    const next = { ...search, [field]: event.target.value };
    if (field === 'checkIn' && next.checkOut <= next.checkIn) {
      next.checkOut = addDays(next.checkIn, 1);
    }
    onChange(next);
  };

  return (
    <form
      className="search-form card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="field">
        <label htmlFor="checkIn">Llegada</label>
        <input id="checkIn" type="date" min={today} value={search.checkIn} onChange={update('checkIn')} required />
      </div>
      <div className="field">
        <label htmlFor="checkOut">Salida</label>
        <input
          id="checkOut"
          type="date"
          min={addDays(search.checkIn, 1)}
          value={search.checkOut}
          onChange={update('checkOut')}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="type">Tipo de habitación</label>
        <select id="type" value={search.type} onChange={update('type')}>
          {ROOM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Buscando…' : 'Buscar disponibilidad'}
      </button>
    </form>
  );
}
