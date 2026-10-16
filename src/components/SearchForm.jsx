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
      <div className="field price-field">
        <label htmlFor="minPrice">Precio por noche (US$)</label>
        <div className="price-range">
          <input
            id="minPrice"
            type="number"
            min="0"
            step="10"
            placeholder="Mín."
            value={search.minPrice}
            onChange={update('minPrice')}
          />
          <span aria-hidden="true">–</span>
          <input
            id="maxPrice"
            type="number"
            min="0"
            step="10"
            placeholder="Máx."
            aria-label="Precio máximo por noche"
            value={search.maxPrice}
            onChange={update('maxPrice')}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="sort">Ordenar por</label>
        <select id="sort" value={search.sort} onChange={update('sort')}>
          <option value="number">Número de habitación</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Buscando…' : 'Buscar disponibilidad'}
      </button>
    </form>
  );
}
