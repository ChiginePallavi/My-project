import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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

const LOCAL_STORAGE_KEY = 'placement-opportunities'
const RECENTLY_VIEWED_KEY = 'placement-recently-viewed'

function DashboardOverview() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [refreshSignal, setRefreshSignal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true)
      setError('')

      try {
        const savedRecords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
        if (Array.isArray(savedRecords) && savedRecords.length > 0) {
          setRecords(savedRecords)
          setLoading(false)
        }

        const savedRecentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
        if (Array.isArray(savedRecentlyViewed)) {
          setRecentlyViewed(savedRecentlyViewed)
        }

        const response = await fetch('/opportunities.json')
        if (!response.ok) {
          throw new Error('Unable to load placement opportunities right now.')
        }

        const data = await response.json()
        const nextRecords = Array.isArray(data) ? data : []
        setRecords(nextRecords)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextRecords))
      } catch (err) {
        setError(err.message || 'Failed to fetch data.')
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [refreshSignal])

  const filteredRecords = records.filter((record) => {
    const query = searchTerm.toLowerCase()
    const haystack = `${record.title} ${record.company} ${record.category} ${record.description} ${record.eligibility} ${record.location}`.toLowerCase()
    return haystack.includes(query)
  })

  const handleView = (record) => {
    const nextViewed = [
      { id: record.id, title: record.title, category: record.category },
      ...recentlyViewed.filter((item) => item.id !== record.id),
    ].slice(0, 4)

    setRecentlyViewed(nextViewed)
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextViewed))
    navigate(`/details/${record.id}`)
  }

  return (
    <>
      <section className="stats-grid">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="dashboard-hero__eyebrow">Live Opportunities</p>
            <h3>Dynamic placement records from an API</h3>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => setRefreshSignal((value) => value + 1)}>
            Refresh Data
          </button>
        </div>

        <div className="search-toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by role, company, category, or location"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {loading && !records.length ? (
          <div className="loading-state">Loading opportunities from the API...</div>
        ) : null}

        {error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" type="button" onClick={() => setRefreshSignal((value) => value + 1)}>
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && !filteredRecords.length ? (
          <div className="empty-state">No opportunities match your search right now.</div>
        ) : null}

        <div className="opportunity-grid">
          {filteredRecords.map((record) => (
            <article className="opportunity-card" key={record.id}>
              <div className="opportunity-card__top">
                <span className="status-pill">{record.category}</span>
                <span className="status-pill subtle">{record.status}</span>
              </div>
              <h4>{record.title}</h4>
              <p>{record.description}</p>
              <div className="opportunity-meta">
                <span>{record.company}</span>
                <span>{record.location}</span>
              </div>
              <div className="opportunity-meta">
                <span>Eligibility: {record.eligibility}</span>
                <span>Deadline: {record.deadline}</span>
              </div>
              <div className="opportunity-meta">
                <span>Package: {record.package}</span>
              </div>
              <button className="btn btn-primary" type="button" onClick={() => handleView(record)}>
                View Details
              </button>
            </article>
          ))}
        </div>
      </section>

      {recentlyViewed.length ? (
        <section className="dashboard-section small">
          <div className="section-heading">
            <div>
              <p className="dashboard-hero__eyebrow">Recently Viewed</p>
              <h3>Keep track of the records you inspected</h3>
            </div>
          </div>
          <ul className="recent-list">
            {recentlyViewed.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="content-grid">
        <InfoCard title="Preparation Checklist" items={checklist} />
        <InfoCard
          title="Suggested Next Steps"
          items={['Attend mock interviews', 'Improve DSA practice', 'Refine projects and portfolio']}
        />
      </section>
    </>
  )
}

function DashboardProfile() {
  return (
    <section className="content-grid">
      <InfoCard title="Profile Snapshot" items={['Student profile verified', 'Career goals: Product Engineering', 'Preferred roles: Frontend and Full Stack']} />
      <InfoCard title="Skill Radar" items={['React', 'JavaScript', 'Data Structures', 'Communication']} />
    </section>
  )
}

function DashboardSettings() {
  return (
    <section className="content-grid">
      <InfoCard title="Account Settings" items={['Notifications enabled', 'Resume visibility set to public', 'Placement alerts active']} />
      <InfoCard title="Preferences" items={['Daily reminders', 'Weekly progress summary', 'Recruiter alerts']} />
    </section>
  )
}

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

      <nav className="dashboard-subnav" aria-label="Dashboard sections">
        <NavLink to="/dashboard/overview" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `dashboard-tab${isActive ? ' active' : ''}`}>
          Settings
        </NavLink>
      </nav>

      <Outlet />
    </main>
  )
}

export { DashboardOverview, DashboardProfile, DashboardSettings }
export default Dashboard
