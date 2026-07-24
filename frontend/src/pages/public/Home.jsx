import { useNavigate } from 'react-router-dom'
import HeroSection from '../../components/layout/HeroSection'
import InfoCard from '../../components/common/InfoCard'
import StatCard from '../../components/common/StatCard'
import FeatureIcons from '../../components/common/FeatureIcons'
import '../../styles/Home.css'

const highlights = [
  'Real-Time Opportunity Search & Filtering',
  'JWT Authenticated Session Security',
  'Role-Based Admin & Student Management',
  'MongoDB Atlas Database Persistence',
]

const stats = [
  { title: 'Students Tracked', value: '1.2k+', detail: 'Active readiness assessments', badge: 'Live' },
  { title: 'Placement Rate', value: '87%', detail: 'Successful drive placements', badge: 'Success' },
  { title: 'Open Opportunities', value: '24', detail: 'Top tech companies hiring', badge: 'Active' },
]

function Home() {
  const navigate = useNavigate()

  return (
    <main className="page home-page">
      <div className="decorative-blob blob-1" />
      <div className="decorative-blob blob-2" />

      <HeroSection
        highlight="Placement Intelligence"
        title="Predict placement readiness with clarity and precision"
        subtitle="A full-stack MERN application connecting students and recruiters with real-time analytics, secure JWT authentication, and placement opportunity tracking."
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
        <InfoCard title="Platform Capabilities" items={highlights} />
        <InfoCard
          title="Architecture Highlights"
          items={[
            'Node.js & Express RESTful API Server',
            'MongoDB Atlas Schema Models with Indexing',
            'JWT Authentication & Bcrypt Password Encryption',
            'Role-Based Authorization (Admin & Student Roles)'
          ]}
        />
      </section>
    </main>
  )
}

export default Home
