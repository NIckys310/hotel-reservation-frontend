const unsplash = (id, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const HERO_IMAGE = unsplash('1520250497591-112f2f40a3f4', 2000);

export const SERVICE_IMAGES = {
  SPA: unsplash('1544161515-4ab6ce6db874', 800),
  BREAKFAST: unsplash('1596701062351-8c2c14d1fdd0', 800),
  TRANSFER: unsplash('1681167816895-940c56e0d2a5', 800),
};

export const SERVICE_DESCRIPTIONS = {
  SPA: 'Circuito de aguas, sauna y masaje relajante de 60 minutos.',
  BREAKFAST: 'Buffet gourmet con frutas, panadería artesanal y café de origen.',
  TRANSFER: 'Traslado privado aeropuerto–hotel en vehículo de lujo.',
};
