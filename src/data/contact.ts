// Company contact details: single source for the contact section and the Organization JSON-LD.
// Address text as given by the client. The map pin uses the OpenStreetMap position of building 7/A
// on this road (public/img/harta-*.{avif,webp}, rendered around exactly these coordinates).
const lat = 47.0652633
const lon = 28.7967624

export const contact = {
  phone: '+373 69 639 911',
  phoneHref: 'tel:+37369639911',
  email: 'contact@spacebox.md',
  street: 'Șoseaua Belceni 7A',
  city: 'Chișinău',
  country: 'MD',
  geo: { lat, lon },
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}`,
  wazeUrl: `https://waze.com/ul?ll=${lat}%2C${lon}&navigate=yes`,
} as const
