// Datos estructurados (schema.org) que Google usa para entender el negocio.
// Se insertan en index.html al compilar. Si cambia algo del taller, se actualiza acá.
export function structuredData(siteUrl) {
  const business = {
    '@type': 'AutoRepair',
    '@id': `${siteUrl}/#taller`,
    name: 'Mecánica William',
    alternateName: ['William Rally Group', 'William Competición'],
    description:
      'Taller mecánico integral en Córdoba desde 1995. Service, motor, caja, tren delantero y frenos para autos de todas las marcas. Diagnóstico computarizado con scanners Autel y preparación de autos de rally.',
    url: `${siteUrl}/`,
    image: [`${siteUrl}/og.jpg`],
    logo: `${siteUrl}/apple-touch-icon.png`,
    telephone: '+54 9 351 653-4162',
    foundingDate: '1995',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nicolás Rodríguez Peña 3210',
      addressLocality: 'Córdoba',
      addressRegion: 'Córdoba',
      postalCode: 'X5000',
      addressCountry: 'AR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -31.3779731, longitude: -64.187757 },
    hasMap: 'https://www.google.com/maps/place/Mec%C3%A1nica+William/@-31.3779728,-64.187795,17z/data=!4m6!3m5!1s0x943299ade1c05895:0xbb695036ef995c02!8m2!3d-31.3779728!4d-64.187795!16s%2Fg%2F11npbk4s3h',
    areaServed: { '@type': 'City', name: 'Córdoba' },
    // Agregá "dayOfWeek" cuando estén confirmados los días de atención, por ejemplo:
    // openingHoursSpecification: [
    //   { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '13:00' },
    //   { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '15:00', closes: '18:00' },
    // ],
    sameAs: ['https://www.instagram.com/mecanicawilliam.wrg/', 'https://www.facebook.com/william.lara.5243'],
    knowsAbout: ['Mecánica integral', 'Diagnóstico computarizado', 'Scanners Autel', 'Preparación de autos de rally'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios',
      itemListElement: [
        'Service y mantenimiento',
        'Diagnóstico computarizado con scanners Autel',
        'Reparación ante rotura',
        'Desarme y armado de motor',
        'Cambio de embrague',
        'Tren delantero y suspensión',
        'Frenos',
        'Preparación de autos y motores de rally',
      ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#web`,
    url: `${siteUrl}/`,
    name: 'Mecánica William',
    inLanguage: 'es-AR',
    publisher: { '@id': `${siteUrl}/#taller` },
  }
  return { '@context': 'https://schema.org', '@graph': [business, website] }
}
