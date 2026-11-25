// Todo el contenido editable de la web está en este archivo.
// Cambiá textos, servicios, años o datos de contacto acá sin tocar los componentes.

import renault from '../assets/marcas/renault.webp'
import chevrolet from '../assets/marcas/chevrolet.webp'
import peugeot from '../assets/marcas/peugeot.webp'
import volkswagen from '../assets/marcas/volkswagen.webp'
import ford from '../assets/marcas/ford.webp'
import honda from '../assets/marcas/honda.webp'
import fiat from '../assets/marcas/fiat.webp'

import rally90s from '../assets/img/rally-90s.webp'
import podio2016 from '../assets/img/podio-2016.webp'
import equipoAutos from '../assets/img/equipo-autos.webp'
import equipoMotor from '../assets/img/equipo-motor.webp'

export const contact = {
  whatsappNumber: '5493516534162',
  whatsappLabel: '351 653-4162',
  whatsappMessage: 'Hola, quiero pedir un turno para mi auto.',
  instagram: { handle: '@williamcompeticion', url: 'https://www.instagram.com/williamcompeticion/' },
  facebook: { url: 'https://www.facebook.com/william.lara.5243' },
  address: ['N. Rodríguez Peña 3210', 'X5000 Córdoba'],
  // "Cómo llegar": abre Google Maps con el recorrido hasta el taller
  mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('William Rally Group, N. Rodríguez Peña 3210, Córdoba')}`,
  // Lo que se busca en Google Maps para el mapa del pie de página
  mapQuery: 'Mecánica William, Nicolás Rodríguez Peña 3210, Córdoba, Argentina',
  shortAddress: 'Rodríguez Peña 3210, Córdoba',
  // Horario cortado: cada línea se muestra por separado
  hours: ['Mañana: 9 a 13 hs', 'Tarde: 15 a 18 hs'],
  // Ficha del taller en Google Maps (ahí están las opiniones). En Google figura como "William Rally Group".
  reviewsUrl: 'https://www.google.com.ar/maps/place/William+Rally+Group/@-31.3779719,-64.1883137,19z/data=!4m5!3m4!1s0x943299750ea183f7:0xce0dbea59366b861!8m2!3d-31.3779731!4d-64.187757',
}

export const whatsappUrl = (message = contact.whatsappMessage) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`

export const nav = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#autel', label: 'Diagnóstico' },
  { href: '#trabajo', label: 'Cómo trabajamos' },
  { href: '#rally', label: 'Rally' },
  { href: '#contacto', label: 'Contacto' },
]

export const brands = [
  { name: 'Renault', src: renault },
  { name: 'Chevrolet', src: chevrolet },
  { name: 'Peugeot', src: peugeot },
  { name: 'Volkswagen', src: volkswagen },
  { name: 'Ford', src: ford },
  { name: 'Honda', src: honda },
  { name: 'Fiat', src: fiat },
]

// tool: llave | destornillador | crique | bujia | vaso | cruz
export const services = [
  { tool: 'vaso', name: 'Service y mantenimiento', text: 'Aceite, filtros, correas, bombas, pastillas y juntas. Te asesoramos entre repuestos originales y segundas marcas según lo que quieras gastar.' },
  { tool: 'crique', name: 'Diagnóstico computarizado', text: 'Scanners Autel: lectura de fallas, sensores y desconfiguraciones de la computadora del auto.' },
  { tool: 'llave', name: 'Reparación ante rotura', text: 'Reemplazamos solo la pieza rota y te contamos cada paso.' },
  { tool: 'bujia', name: 'Motor', text: 'Armado completo: desarme, medición, rectificado de cilindros y cigüeñal, puesta a punto.' },
  { tool: 'cruz', name: 'Caja y embrague', text: 'Reparación y cambio de embrague, caja manual y transmisión.' },
  { tool: 'destornillador', name: 'Tren delantero y suspensión', text: 'Rótulas, extremos, amortiguadores, bujes y alineación.' },
  { tool: 'llave', name: 'Frenos', text: 'Pastillas, discos, campanas, bomba y líquido.' },
  { tool: 'bujia', name: 'Inyección y electricidad', text: 'Sensores, inyectores, encendido y cableado.' },
  { tool: 'crique', name: 'Autos de rally', text: 'Preparación y armado de motor de competición según parámetros FIA.' },
]

export const workSteps = [
  { title: 'Escaneamos el auto', text: 'Conectamos el Autel y leemos todas sus computadoras.' },
  { title: 'Te pasamos el presupuesto', text: 'Sabés qué tiene y cuánto sale antes de que toquemos nada.' },
  { title: 'Reparamos solo lo necesario', text: 'Si algo puede esperar, te lo decimos.' },
  { title: 'Te lo entregamos probado', text: 'Volvemos a escanear y lo probamos en la calle.' },
]

// Etapas de la animación de la maleta (en orden)
export const autelStages = ['Trabas', 'Tapa', 'Scanner', 'Diagnóstico']

export const titles = [
  { year: '1999', text: 'Primer campeonato del Rally Cordobés, después de miles de kilómetros de tramos.' },
  { year: '2003', text: 'Segundo campeonato con el equipo de competición.' },
  { year: '2016', text: 'Campeones del Rally Provincial con Matías Brenzoni y Federico Baratella.' },
  { year: '2019', text: 'Campeones otra vez, con Javier y Darío Ramírez al mando.' },
]

export const rallyPhotos = [
  { src: rally90s, alt: 'Auto rojo del equipo en una largada de rally en los años noventa' },
  { src: podio2016, alt: 'Pilotos levantando los trofeos del campeonato 2016' },
  { src: equipoAutos, alt: 'El equipo del taller junto a los autos de competición' },
  { src: equipoMotor, alt: 'El equipo en el taller con un motor armado' },
]

export const reviews = [
  { quote: 'Mi mecánico de siempre, excelente ser humano y mejor mecánico.', author: 'José Rodríguez' },
  { quote: 'Excelente atención. Me diagnosticaron una falla en un sensor en cuestión de minutos.', author: 'Maximiliano Carreras' },
]
