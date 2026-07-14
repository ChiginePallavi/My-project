import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import InfoCard from '../components/InfoCard'
import '../styles/Home.css'

const highlights = [
  'React components with reusable props',
  'Vite-based development workflow',
  'Structured pages for home and dashboard views',
]

function Home() {
  const navigate = useNavigate()

  return (
    <main className="page home-page">
      <HeroSection
        highlight="Routing and Layouts"
        title="Predict placement readiness with a clean React experience"
        subtitle="This interface demonstrates component-based architecture, reusable UI elements, and a guided dashboard flow for students and recruiters."
        primaryAction="Register Now"
        secondaryAction="Explore Dashboard"
        onPrimaryAction={() => navigate('/register')}
        onSecondaryAction={() => navigate('/dashboard')}
      />

      <section className="content-grid">
        <InfoCard title="Project Goals" items={highlights} />
        <InfoCard
          title="React Concepts Covered"
          items={['Props', 'Functional Components', 'Module Exports', 'React Router']}
        />
      </section>
    </main>
  )
}

export default Home
