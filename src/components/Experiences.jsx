import { SERVICE_DESCRIPTIONS, SERVICE_IMAGES } from '../utils/images';
import { formatMoney } from '../utils/format';

export default function Experiences({ catalog }) {
  if (catalog.length === 0) return null;
  return (
    <section className="experiences" aria-labelledby="experiences-title">
      <h2 id="experiences-title">Experiencias del hotel</h2>
      <p className="muted">Agrégalas al reservar o desde el panel de gestión de tu reserva.</p>
      <div className="experience-grid">
        {catalog.map((service) => (
          <article key={service.type} className="experience-card">
            <img src={SERVICE_IMAGES[service.type]} alt={service.label} loading="lazy" />
            <div className="experience-body">
              <h3>{service.label}</h3>
              <p>{SERVICE_DESCRIPTIONS[service.type]}</p>
              <strong>
                {formatMoney(service.price)}
                {service.chargedPerDay ? ' por día' : ''}
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
