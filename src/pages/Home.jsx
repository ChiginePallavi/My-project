import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import InfoCard from '../components/InfoCard'
import StatCard from '../components/StatCard'
import FeatureIcons from '../components/FeatureIcons'
import '../styles/Home.css'

const highlights = [
  'React components with reusable props',
  'Vite-based development workflow',
  'Structured pages for home and dashboard views',
]

const stats = [
  { title: 'Students Tracked', value: '1.2k', detail: 'Active assessments', badge: 'Growth' },
  { title: 'Placement Rate', value: '87%', detail: 'Last 6 months', badge: 'Success' },
  { title: 'Open Roles', value: '24', detail: 'Companies hiring', badge: 'Opportunities' },
]

function Home() {
  const navigate = useNavigate()

  return (
    <main className="page home-page">
      <div className="decorative-blob blob-1" />
      <div className="decorative-blob blob-2" />

      <HeroSection
        highlight="Placement Intelligence"
        title="Predict placement readiness with clarity and style"
        subtitle="A creative, component-driven UI that helps students and recruiters discover fit and readiness at a glance."
        primaryAction="Get Started"
        secondaryAction="View Dashboard"
        onPrimaryAction={() => navigate('/register')}
        onSecondaryAction={() => navigate('/dashboard')}
      />

      <FeatureIcons />

      <section className="creative-stats">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} detail={s.detail} badge={s.badge} />
        ))}
      </section>

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
