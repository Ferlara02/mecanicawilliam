import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import Brands from './sections/Brands.jsx'
import Services from './sections/Services.jsx'
import Autel from './sections/Autel.jsx'
import WorkOrder from './sections/WorkOrder.jsx'
import RallyHero from './sections/RallyHero.jsx'
import RallyTitles from './sections/RallyTitles.jsx'
import Reviews from './sections/Reviews.jsx'
import Contact from './sections/Contact.jsx'
import { useRevealOnScroll } from './hooks/reveal.js'

// Orden de las secciones de la home. Para mover o quitar una, cambiá esta lista.
export default function App() {
  useRevealOnScroll()
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Hero />
        <Brands />
        <Services />
        <Autel />
        <WorkOrder />
        <RallyHero />
        <RallyTitles />
        <Reviews />
      </main>
      <Contact />
    </>
  )
}
