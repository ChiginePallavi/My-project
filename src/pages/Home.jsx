import HeroSection from '../components/HeroSection'
import InfoCard from '../components/InfoCard'
import '../styles/Home.css'

const highlights = [
  'React components with reusable props',
  'Vite-based development workflow',
  'Structured pages for home and dashboard views',
]

function Home({ onNavigate }) {
  return (
    <main className="page home-page">
      <HeroSection
        highlight="Initial UI Build"
        title="Predict placement readiness with a clean React experience"
        subtitle="This interface demonstrates component-based architecture, reusable UI elements, and a guided dashboard flow for students and recruiters."
        primaryAction="Register Now"
        secondaryAction="Explore Dashboard"
        onPrimaryAction={() => onNavigate('register')}
        onSecondaryAction={() => onNavigate('dashboard')}
      />

      <section className="content-grid">
        <InfoCard title="Project Goals" items={highlights} />
        <InfoCard
          title="React Concepts Covered"
          items={['Props', 'Functional Components', 'Module Exports', 'Component Reusability']}
        />
      </section>
    </main>
  )
}

export default Home
