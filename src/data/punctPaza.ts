// Source of truth: example_images/punct_modular_de_paza.jpeg (spec sheet).

export interface ColorOption {
  name: string
  ral: string
  hex: string
  /** true = officially listed in the spec sheet */
  official?: boolean
}

export const colorOptions: ColorOption[] = [
  { name: 'Gri deschis', ral: 'RAL 7035', hex: '#c9ccc7', official: true },
  { name: 'Antracit', ral: 'RAL 7016', hex: '#373d41', official: true },
  { name: 'Alb trafic', ral: 'RAL 9016', hex: '#eef0ea' },
  { name: 'Verde mușchi', ral: 'RAL 6005', hex: '#2c4a3b' },
]

export interface Spec {
  label: string
  value: string
}

export const specs: Spec[] = [
  { label: 'Suprafață utilă', value: '7.20 m²' },
  { label: 'Lungime', value: '3.00 m' },
  { label: 'Lățime', value: '2.40 m' },
  { label: 'Înălțime interioară', value: '2.80 m' },
  { label: 'Înălțime exterioară', value: '2.95 m' },
  { label: 'Număr module', value: '1' },
  { label: 'Structură', value: 'Oțel galvanizat' },
  { label: 'Izolație', value: 'Vată minerală 50 mm' },
  { label: 'Finisaj interior', value: 'Gips-carton + vopsea lavabilă' },
  { label: 'Finisaj exterior', value: 'Panou sandwich' },
  { label: 'Tâmplărie', value: 'PVC / Aluminiu, geam termopan' },
  { label: 'Timp execuție', value: 'de la 15 zile' },
]

export const product = {
  slug: 'punct-de-paza',
  name: 'Punct de Pază Modular',
  kind: 'Tip container modular · 3.00 × 2.40 × 2.80 m',
  intro:
    'Cabină de pază robustă, gata de instalat. Structură din oțel galvanizat, izolație din vată minerală și finisaje la cheie. Explorează modelul 3D, vezi interiorul și alege culoarea.',
}

// Hotspot copy (positions live in the 3D viewer).
export interface HotspotInfo {
  id: string
  title: string
  body: string
}

export const hotspots: HotspotInfo[] = [
  { id: 'usa', title: 'Ușă dublă de acces', body: 'Ușă dublă pentru acces personal, tâmplărie PVC/Aluminiu cu geam termopan și încuietoare cu cilindru.' },
  { id: 'fereastra', title: 'Fereastră termopan', body: 'Ferestre PVC/Aluminiu cu geam termopan, oscilo-batante, cu rame albe și plasă opțională.' },
  { id: 'ac', title: 'Aer condiționat', body: 'Unitate split de aer condiționat inclusă, pentru confort termic în orice sezon.' },
  { id: 'structura', title: 'Structură & colțari', body: 'Cadru din oțel galvanizat cu colțari tip container, pentru transport și amplasare rapidă.' },
  { id: 'panou', title: 'Panou sandwich', body: 'Pereți din panou sandwich cu izolație din vată minerală 50 mm: eficient termic și ignifug.' },
  { id: 'birou', title: 'Interior la cheie', body: 'Finisaj interior gips-carton + vopsea lavabilă, pardoseală, birou și scaun. Gata de utilizare.' },
]
