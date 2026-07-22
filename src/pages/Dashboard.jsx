import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import InfoCard from '../components/InfoCard'
import { createOpportunity, deleteOpportunity, getOpportunityById, getOpportunities, updateOpportunity } from '../services/api'
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
        const params = searchTerm ? { search: searchTerm.trim() } : {}
        const response = await getOpportunities(params)

        setRecords(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(err.message || 'Failed to fetch data from the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [refreshSignal, searchTerm])

  const addActivity = (message) => {
    setActivityLog((current) => [{ id: Date.now(), message, at: new Date().toLocaleString() }, ...current].slice(0, 5))
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.company.trim() || !formData.category.trim() || !formData.description.trim()) {
      setError('Please complete the title, company, category, and description fields before saving.')
      return
    }

    const payload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      category: formData.category.trim(),
      status: formData.status,
      location: formData.location.trim(),
      eligibility: formData.eligibility.trim(),
      deadline: formData.deadline.trim(),
      package: formData.package.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
    }

    setLoading(true)
    setError('')

    try {
      if (editingId) {
        const response = await updateOpportunity(editingId, payload)
        const updatedRecord = response.data
        setRecords((current) =>
          current.map((record) =>
            String(record.id || record._id) === String(editingId) ? updatedRecord : record
          )
        )
        setStatusMessage(`Updated ${updatedRecord.title} successfully.`)
        addActivity(`Updated ${updatedRecord.title}`)
      } else {
        const response = await createOpportunity(payload)
        const createdRecord = response.data
        setRecords((current) => [createdRecord, ...current])
        setStatusMessage(`Added ${createdRecord.title} successfully.`)
        addActivity(`Added ${createdRecord.title}`)
      }

      resetForm()
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to save the record.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (record) => {
    setEditingId(record.id || record._id)
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

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    const target = deleteTarget
    setLoading(true)
    setError('')

    try {
      await deleteOpportunity(target.id || target._id)
      const nextRecords = records.filter(
        (record) => String(record.id || record._id) !== String(target.id || target._id)
      )
      setRecords(nextRecords)
      setPendingDelete(target)
      setDeleteTarget(null)
      setStatusMessage(`Deleted ${target.title} successfully.`)
      addActivity(`Deleted ${target.title}`)
    } catch (err) {
      setError(err.message || 'Unable to delete the record.')
    } finally {
      setLoading(false)
    }
  }

  const undoDelete = async () => {
    if (!pendingDelete) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = { ...pendingDelete }
      delete payload.id
      delete payload._id

      const response = await createOpportunity(payload)
      setRecords((current) => [response.data, ...current])
      setPendingDelete(null)
      setStatusMessage(`Restored ${response.data.title}.`)
      addActivity(`Restored ${response.data.title}`)
    } catch (err) {
      setError(err.message || 'Unable to restore the record.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (record) => {
    const nextViewed = [
      { id: record.id || record._id, title: record.title, category: record.category },
      ...recentlyViewed.filter((item) => String(item.id) !== String(record.id || record._id)),
    ].slice(0, 4)

    setRecentlyViewed(nextViewed)
    navigate(`/details/${record.id || record._id}`)
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

      const createdRecords = await Promise.all(
        importedRecords.map(async (item) => {
          const payload = { ...item }
          delete payload.id
          delete payload._id
          const response = await createOpportunity(payload)
          return response.data
        })
      )

      setRecords((current) => [...createdRecords, ...current])
      setStatusMessage('Imported records to backend successfully.')
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
            <p className="dashboard-hero__eyebrow">Placement Records</p>
            <h3>Manage placement opportunities with backend-driven CRUD</h3>
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
            {loading && !records.length ? <div className="loading-state">Loading opportunities from the backend...</div> : null}

            {!loading && !error && !filteredRecords.length ? (
              <div className="empty-state">No opportunities match your search right now.</div>
            ) : null}

            <div className="opportunity-grid">
              {filteredRecords.map((record) => (
                <article className="opportunity-card" key={record.id || record._id}>
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
            <p>This action removes {deleteTarget.title} from the backend immediately.</p>
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
            <h3>Latest activity from backend operations</h3>
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
