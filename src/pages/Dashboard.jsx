import StatCard from '../components/StatCard'
import InfoCard from '../components/InfoCard'
import '../styles/Dashboard.css'

const metrics = [
  { title: 'Eligibility Rate', value: '87%', detail: 'Based on current academic and skill data', badge: 'Live' },
  { title: 'Skill Strength', value: 'Strong', detail: 'Communication and problem solving are above target', badge: 'Focus' },
  { title: 'Interview Readiness', value: 'Ready', detail: 'Mock interviews completed this month', badge: 'Ready' },
]

const checklist = [
  'Resume polishing completed',
  'GitHub profile verified',
  'Aptitude practice scheduled',
  'Technical interview prep in progress',
]

function Dashboard() {
  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Placement Dashboard</p>
          <h2>Track your readiness at a glance</h2>
        </div>
        <p>Use the dashboard to review performance insights and preparation milestones before the next placement drive.</p>
      </section>

      <section className="stats-grid">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="content-grid">
        <InfoCard title="Preparation Checklist" items={checklist} />
        <InfoCard
          title="Suggested Next Steps"
          items={['Attend mock interviews', 'Improve DSA practice', 'Refine projects and portfolio']}
        />
      </section>
    </main>
  )
}

export default Dashboard
