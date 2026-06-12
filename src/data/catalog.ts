export interface Spec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  kind: string
  blurb: string
  image: string
  alt: string
  specs: Spec[]
  featured?: boolean
}

// Source of truth: example_images/ spec sheets. Dimensions/specs are quoted verbatim.
export const products: Product[] = [
  {
    id: 'capsule',
    name: 'Capsulă Premium 11.5 m',
    kind: 'Locuire premium',
    blurb:
      'Carcasă albă cu forme rotunjite, ferestre angulare cu rame negre și interior cald. Living și dormitor, gata de locuit. Disponibilă cu sau fără balcon.',
    image: '/renders/capsule-hero.png',
    alt: 'Capsulă modulară premium albă cu ferestre mari fumurii, amplasată pe o pajiște la apus',
    featured: true,
    specs: [
      { label: 'Lungime', value: '11.5 m' },
      { label: 'Lățime', value: '~3.0 m' },
      { label: 'Compartimentare', value: 'Living + dormitor' },
      { label: 'Variante', value: 'Cu / fără balcon' },
    ],
  },
  {
    id: 'container-locuibil',
    name: 'Container Modular Locuibil',
    kind: 'Birou · cazare · locuire',
    blurb:
      'Panouri sandwich pe structură metalică, tâmplărie PVC termopan, aer condiționat. Configurabil ca birou de șantier, dormitor sau spațiu de locuit.',
    image: '/gallery/container-exterior.jpeg',
    alt: 'Container modular locuibil gri deschis cu două ferestre și ușă centrală',
    specs: [
      { label: 'Structură', value: 'Metalică' },
      { label: 'Finisaj', value: 'Panou sandwich' },
      { label: 'Tâmplărie', value: 'PVC termopan' },
      { label: 'Dotări', value: 'Aer condiționat' },
    ],
  },
  {
    id: 'doua-niveluri',
    name: 'Container 2 Niveluri + Terasă',
    kind: 'Birou · showroom · HoReCa',
    blurb:
      'Fațadă integral vitrată cu uși glisante, scară exterioară și terasă pe acoperiș cu balustradă. Pentru spații comerciale care vor să fie văzute.',
    image: '/gallery/doua-niveluri.jpeg',
    alt: 'Container modular pe două niveluri, gri antracit, cu fațadă vitrată și terasă pe acoperiș',
    specs: [
      { label: 'Niveluri', value: '2' },
      { label: 'Fațadă', value: 'Integral vitrată' },
      { label: 'Acces terasă', value: 'Scară exterioară' },
      { label: 'Culoare', value: 'Antracit' },
    ],
  },
  {
    id: 'chiosc',
    name: 'Chioșc Fructe și Legume',
    kind: 'Container modular 6×3 m',
    blurb:
      'Chioșc comercial complet echipat: panouri sandwich, iluminat LED interior și exterior, aer condiționat și două ferestre de vânzare cu deschidere în sus și blat de servire.',
    image: '/gallery/chiosc.jpeg',
    alt: 'Chioșc modular antracit pentru fructe și legume, cu ferestre de vânzare deschise și rafturi iluminate',
    specs: [
      { label: 'Dimensiuni', value: '6.00 × 3.00 × 2.60 m' },
      { label: 'Culoare', value: 'Antracit (RAL 7016)' },
      { label: 'Ferestre vânzare', value: '2, deschidere sus' },
      { label: 'Dotări', value: 'LED + aer condiționat' },
    ],
  },
  {
    id: 'punct-paza',
    name: 'Punct de Pază Modular',
    kind: 'Container 3.00 × 2.40 m',
    blurb:
      'Cabină de pază robustă: structură din oțel galvanizat, izolație din vată minerală, finisaj interior gips-carton cu vopsea lavabilă. Execuție de la 15 zile.',
    image: '/gallery/punct-paza.jpeg',
    alt: 'Punct de pază modular gri cu uși duble vitrate și ferestre laterale',
    specs: [
      { label: 'Suprafață utilă', value: '7.20 m²' },
      { label: 'Structură', value: 'Oțel galvanizat' },
      { label: 'Izolație', value: 'Vată minerală 50 mm' },
      { label: 'Culori', value: 'RAL 7035 / 7016' },
    ],
  },
]

export interface Usp {
  metric: string
  unit: string
  title: string
  body: string
  prefix?: string
}

export const usps: Usp[] = [
  {
    prefix: 'de la',
    metric: '15',
    unit: 'zile',
    title: 'Livrare rapidă',
    body: 'De la comandă la montaj pe teren, fără șantier interminabil. Te muți în săptămâni, nu în ani.',
  },
  {
    metric: '100',
    unit: '% oțel galvanizat',
    title: 'Structură durabilă',
    body: 'Cadru din oțel galvanizat și izolație din vată minerală: rezistent, eficient termic, fără surprize.',
  },
  {
    metric: '5',
    unit: '+ configurații',
    title: 'Personalizabil',
    body: 'Culori RAL, dimensiuni și dotări la alegere: LED, aer condiționat, balcon, finisaje la cheie.',
  },
]

export interface ProcessStep {
  step: string
  title: string
  body: string
}

export const processSteps: ProcessStep[] = [
  { step: '01', title: 'Configurare', body: 'Alegi modelul, dimensiunile, culorile RAL și dotările. Primești ofertă fermă.' },
  { step: '02', title: 'Producție', body: 'Construim unitatea în atelier, sub control de calitate, independent de vreme.' },
  { step: '03', title: 'Finisaje', body: 'Tâmplărie termopan, izolație, instalații și finisaje interioare la cheie.' },
  { step: '04', title: 'Montaj', body: 'Transport și amplasare pe teren. Modulul e gata de folosit la livrare.' },
]
