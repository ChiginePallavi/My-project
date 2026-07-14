import { useEffect, useRef, useState } from 'react'
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
const ACTIVITY_KEY = 'placement-activity'
const SESSION_SEARCH_KEY = 'placement-search-term'

const defaultFormState = {
  title: '',
  company: '',
  category: '',
  status: 'Open',
  location: '',
  eligibility: '',
  deadline: '',
  package: '',
  description: '',
  image: '',
}

function DashboardOverview() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem(SESSION_SEARCH_KEY) || '')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [formData, setFormData] = useState(defaultFormState)
  const [editingId, setEditingId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [activityLog, setActivityLog] = useState([])
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.setItem(SESSION_SEARCH_KEY, searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true)
      setError('')

      try {
        const savedRecords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
        const savedRecentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
        const savedActivity = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]')

        if (Array.isArray(savedRecords)) {
          setRecords(savedRecords)
        }

        if (Array.isArray(savedRecentlyViewed)) {
          setRecentlyViewed(savedRecentlyViewed)
        }

        if (Array.isArray(savedActivity)) {
          setActivityLog(savedActivity)
        }

        if (Array.isArray(savedRecords) && savedRecords.length > 0) {
          setLoading(false)
          return
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

  const saveRecords = (nextRecords, nextRecentlyViewed = recentlyViewed) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextRecords))
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextRecentlyViewed))
  }

  const addActivity = (message) => {
    setActivityLog((current) => {
      const next = [{ id: Date.now(), message, at: new Date().toLocaleString() }, ...current].slice(0, 5)
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next))
      return next
    })
  }

  const filteredRecords = records.filter((record) => {
    const query = searchTerm.toLowerCase()
    const haystack = `${record.title} ${record.company} ${record.category} ${record.description} ${record.eligibility} ${record.location}`.toLowerCase()
    return haystack.includes(query)
  })

  const resetForm = () => {
    setEditingId(null)
    setFormData(defaultFormState)
    setStatusMessage('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.company.trim() || !formData.category.trim() || !formData.description.trim()) {
      setError('Please complete the title, company, category, and description fields before saving.')
      return
    }

    const nextRecord = {
      ...formData,
      id: editingId || Date.now(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      eligibility: formData.eligibility.trim(),
      deadline: formData.deadline.trim(),
      package: formData.package.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
    }

    let nextRecords = []

    if (editingId) {
      nextRecords = records.map((record) => (String(record.id) === String(editingId) ? nextRecord : record))
      setStatusMessage(`Updated ${nextRecord.title} in local storage.`)
      addActivity(`Updated ${nextRecord.title}`)
    } else {
      nextRecords = [nextRecord, ...records]
      setStatusMessage(`Added ${nextRecord.title} to your local records.`)
      addActivity(`Added ${nextRecord.title}`)
    }

    setRecords(nextRecords)
    saveRecords(nextRecords)
    resetForm()
    setError('')
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    setFormData({
      ...defaultFormState,
      title: record.title || '',
      company: record.company || '',
      category: record.category || '',
      status: record.status || 'Open',
      location: record.location || '',
      eligibility: record.eligibility || '',
      deadline: record.deadline || '',
      package: record.package || '',
      description: record.description || '',
      image: record.image || '',
    })
    setStatusMessage('Editing existing record. Update the form and save changes.')
  }

  const confirmDelete = () => {
    if (!deleteTarget) {
      return
    }

    const target = deleteTarget
    const nextRecords = records.filter((record) => String(record.id) !== String(target.id))
    setRecords(nextRecords)
    saveRecords(nextRecords)
    setPendingDelete(target)
    setDeleteTarget(null)
    setStatusMessage(`Removed ${target.title} from local storage.`)
    addActivity(`Deleted ${target.title}`)
  }

  const undoDelete = () => {
    if (!pendingDelete) {
      return
    }

    const nextRecords = [pendingDelete, ...records]
    setRecords(nextRecords)
    saveRecords(nextRecords)
    setPendingDelete(null)
    setStatusMessage(`Restored ${pendingDelete.title}.`)
    addActivity(`Restored ${pendingDelete.title}`)
  }

  const handleView = (record) => {
    const nextViewed = [
      { id: record.id, title: record.title, category: record.category },
      ...recentlyViewed.filter((item) => item.id !== record.id),
    ].slice(0, 4)

    setRecentlyViewed(nextViewed)
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextViewed))
    navigate(`/details/${record.id}`)
  }

  const handleExport = () => {
    const payload = JSON.stringify(records, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'placement-records.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatusMessage('Exported records as JSON.')
    addActivity('Exported records as JSON')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const importedText = await file.text()
      const importedRecords = JSON.parse(importedText)

      if (!Array.isArray(importedRecords)) {
        throw new Error('The selected file does not contain a valid JSON array of records.')
      }

      const nextRecords = [
        ...importedRecords,
        ...records.filter((record) => !importedRecords.some((item) => String(item.id) === String(record.id))),
      ]

      setRecords(nextRecords)
      saveRecords(nextRecords)
      setStatusMessage('Imported records successfully.')
      addActivity('Imported records from JSON')
    } catch (err) {
      setError(err.message || 'Unable to import the selected JSON file.')
    } finally {
      event.target.value = ''
    }
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
            <p className="dashboard-hero__eyebrow">Local Records</p>
            <h3>Manage placement opportunities with persistence and CRUD</h3>
          </div>
          <div className="button-row">
            <button className="btn btn-secondary" type="button" onClick={() => setRefreshSignal((value) => value + 1)}>
              Refresh Data
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleExport}>
              Export JSON
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => fileInputRef.current?.click()}>
              Import JSON
            </button>
            <input ref={fileInputRef} className="sr-only" type="file" accept="application/json" onChange={handleImport} />
          </div>
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

        {statusMessage ? <div className="success-state">{statusMessage}</div> : null}
        {error ? <div className="error-state">{error}</div> : null}

        <div className="management-grid">
          <form className="crud-form" onSubmit={handleSubmit}>
            <div className="section-heading compact">
              <div>
                <p className="dashboard-hero__eyebrow">Add or Edit</p>
                <h4>{editingId ? 'Update an existing opportunity' : 'Create a new opportunity'}</h4>
              </div>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Title</span>
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Frontend Developer" />
              </label>
              <label className="form-field">
                <span>Company</span>
                <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Acme Labs" />
              </label>
              <label className="form-field">
                <span>Category</span>
                <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Product" />
              </label>
              <label className="form-field">
                <span>Status</span>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Open">Open</option>
                  <option value="In Review">In Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>
              <label className="form-field">
                <span>Location</span>
                <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Remote" />
              </label>
              <label className="form-field">
                <span>Eligibility</span>
                <input name="eligibility" value={formData.eligibility} onChange={handleInputChange} placeholder="CGPA 7.5+" />
              </label>
              <label className="form-field">
                <span>Deadline</span>
                <input name="deadline" value={formData.deadline} onChange={handleInputChange} placeholder="2026-08-31" />
              </label>
              <label className="form-field">
                <span>Package</span>
                <input name="package" value={formData.package} onChange={handleInputChange} placeholder="12 LPA" />
              </label>
              <label className="form-field full-width">
                <span>Description</span>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the opportunity" rows="3" />
              </label>
              <label className="form-field full-width">
                <span>Image URL</span>
                <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/logo.png" />
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? 'Save Changes' : 'Add Record'}
              </button>
              {editingId ? (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="records-panel">
            {loading && !records.length ? <div className="loading-state">Loading opportunities from local storage...</div> : null}

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
                  <div className="card-actions">
                    <button className="btn btn-primary" type="button" onClick={() => handleView(record)}>
                      View
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={() => handleEdit(record)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => setDeleteTarget(record)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {deleteTarget ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Delete this record?</h3>
            <p>This action removes {deleteTarget.title} from local storage immediately.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" type="button" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDelete ? (
        <div className="undo-banner">
          <span>{pendingDelete.title} was removed. You can restore it.</span>
          <button className="btn btn-secondary" type="button" onClick={undoDelete}>
            Undo Delete
          </button>
        </div>
      ) : null}

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

      <section className="dashboard-section small">
        <div className="section-heading">
          <div>
            <p className="dashboard-hero__eyebrow">Recent Activity</p>
            <h3>Latest local storage actions</h3>
          </div>
        </div>
        <ul className="recent-list compact-list">
          {activityLog.length ? activityLog.map((item) => (
            <li key={item.id}>
              <strong>{item.message}</strong>
              <span>{item.at}</span>
            </li>
          )) : <li>No recent activity yet.</li>}
        </ul>
      </section>

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
