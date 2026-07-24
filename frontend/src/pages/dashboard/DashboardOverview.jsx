import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import InfoCard from '../../components/common/InfoCard'
import OpportunityCard from './OpportunityCard'
import OpportunityForm from './OpportunityForm'
import DeleteModal from './DeleteModal'
import { createOpportunity, deleteOpportunity, getOpportunities } from '../../services/api'
import '../../styles/Dashboard.css'

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

function DashboardOverview(props) {
  const context = useOutletContext() || {}
  const activeUser = props.activeUser || context.activeUser
  const isAdmin = activeUser?.role === 'admin'

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem(SESSION_SEARCH_KEY) || '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(() => sessionStorage.getItem(SESSION_SEARCH_KEY) || '')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [formData, setFormData] = useState(defaultFormState)
  const [statusMessage, setStatusMessage] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [activityLog, setActivityLog] = useState([])
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    sessionStorage.setItem(SESSION_SEARCH_KEY, searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
      setPage(1)
    }, 400)

    return () => clearTimeout(debounce)
  }, [searchTerm])

  useEffect(() => {
    if (location.state?.success) {
      setStatusMessage(location.state.success)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true)
      setError('')

      try {
        const params = {
          page,
          limit,
          sort: sortBy,
          order: sortOrder,
        }

        if (debouncedSearchTerm) {
          params.search = debouncedSearchTerm
        }

        const response = await getOpportunities(params)
        const data = Array.isArray(response.data) ? response.data : []

        setRecords(data)
        setTotalRecords(response.total || 0)
        setTotalPages(response.pages || 1)

        if (response.pages && page > response.pages) {
          setPage(response.pages)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch data from backend.')
        setRecords([])
        setTotalRecords(0)
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [refreshSignal, page, limit, sortBy, sortOrder, debouncedSearchTerm])

  const addActivity = (message) => {
    setActivityLog((current) => [{ id: Date.now(), message, at: new Date().toLocaleString() }, ...current].slice(0, 5))
  }

  const resetForm = () => {
    setFormData(defaultFormState)
    setStatusMessage('')
  }

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return
    }
    setPage(nextPage)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setLimit(6)
    setPage(1)
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
      const response = await createOpportunity(payload)
      const createdRecord = response.data
      setRecords((current) => [createdRecord, ...current])
      setStatusMessage(`Added ${createdRecord.title} successfully.`)
      addActivity(`Added ${createdRecord.title}`)
      resetForm()
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to save the record.')
    } finally {
      setLoading(false)
    }
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

  const handleEdit = (record) => {
    navigate(`/edit/${record.id || record._id}`)
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <p className="dashboard-hero__eyebrow" style={{ margin: 0 }}>Placement Records</p>
              <span className={`status-pill ${isAdmin ? '' : 'subtle'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {isAdmin ? '🛡️ Admin Role (Full Control)' : '🎓 Student Role (Read-Only)'}
              </span>
            </div>
            <h3>{isAdmin ? 'Manage placement opportunities with backend-driven CRUD' : 'Browse placement opportunities & check eligibility'}</h3>
          </div>
          <div className="button-row">
            <button className="btn btn-secondary" type="button" onClick={() => setRefreshSignal((value) => value + 1)}>
              Refresh Data
            </button>
            {isAdmin && (
              <>
                <button className="btn btn-secondary" type="button" onClick={handleExport}>
                  Export JSON
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                  Import JSON
                </button>
                <input ref={fileInputRef} className="sr-only" type="file" accept="application/json" onChange={handleImport} />
              </>
            )}
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
          <div className="toolbar-controls">
            <label>
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} disabled={loading}>
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="company">Company</option>
                <option value="category">Category</option>
                <option value="deadline">Deadline</option>
              </select>
            </label>
            <label>
              Order
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} disabled={loading}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </label>
            <label>
              Page size
              <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1) }} disabled={loading}>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
              </select>
            </label>
            <button className="btn btn-secondary" type="button" onClick={handleResetFilters} disabled={loading}>
              Reset
            </button>
          </div>
        </div>

        {statusMessage ? <div className="success-state">{statusMessage}</div> : null}
        {error ? <div className="error-state">{error}</div> : null}

        <div className="record-summary">
          <span>
            Showing {totalRecords === 0 ? 0 : (page - 1) * limit + 1} - {Math.min(page * limit, totalRecords)} of {totalRecords} records
          </span>
        </div>

        <div className={`management-grid ${isAdmin ? '' : 'single-column'}`}>
          {isAdmin ? (
            <OpportunityForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : null}

          <div className="records-panel">
            {loading && !records.length ? <div className="loading-state">Loading opportunities from the backend...</div> : null}

            {!loading && !error && !records.length ? (
              <div className="empty-state">No records were found for your search criteria.</div>
            ) : null}

            <div className="opportunity-grid">
              {records.map((record) => (
                <OpportunityCard
                  key={record.id || record._id}
                  record={record}
                  isAdmin={isAdmin}
                  loading={loading}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={setDeleteTarget}
                />
              ))}
            </div>

            <div className="pagination-controls">
              <button className="btn btn-secondary" type="button" onClick={() => handlePageChange(page - 1)} disabled={loading || page <= 1}>
                Previous
              </button>
              <span className="page-indicator">
                Page {page} of {Math.max(totalPages, 1)}
              </span>
              <button className="btn btn-secondary" type="button" onClick={() => handlePageChange(page + 1)} disabled={loading || page >= totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <DeleteModal
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        setDeleteTarget={setDeleteTarget}
      />

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

export default DashboardOverview
