import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/Dashboard.css'

const LOCAL_STORAGE_KEY = 'placement-opportunities'
const RECENTLY_VIEWED_KEY = 'placement-recently-viewed'

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true)
      setError('')

      try {
        const cachedRecords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
        const cachedRecord = cachedRecords.find((item) => String(item.id) === String(id))

        if (cachedRecord) {
          setRecord(cachedRecord)
        }

        const response = await fetch('/opportunities.json')
        if (!response.ok) {
          throw new Error('The requested detail could not be loaded.')
        }

        const opportunities = await response.json()
        const nextRecord = opportunities.find((item) => String(item.id) === String(id)) || null
        setRecord(nextRecord)

        const nextCachedRecords = [...cachedRecords.filter((item) => String(item.id) !== String(id)), ...(nextRecord ? [nextRecord] : [])]
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextCachedRecords))

        const viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
        const nextViewed = [
          { id: nextRecord?.id, title: nextRecord?.title, category: nextRecord?.category },
          ...viewed.filter((item) => item.id !== nextRecord?.id),
        ].filter(Boolean).slice(0, 4)
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextViewed))
      } catch (err) {
        setError(err.message || 'Something went wrong while loading the details page.')
      } finally {
        setLoading(false)
      }
    }

    loadRecord()
  }, [id])

  if (loading) {
    return (
      <main className="page dashboard-page">
        <section className="dashboard-hero">
          <p className="dashboard-hero__eyebrow">Loading details</p>
          <h2>Fetching the selected record...</h2>
          <p>Please wait while the page prepares the complete information.</p>
        </section>
      </main>
    )
  }

  if (error || !record) {
    return (
      <main className="page dashboard-page">
        <section className="dashboard-hero">
          <p className="dashboard-hero__eyebrow">Record not found</p>
          <h2>{error || 'No placement activity matched this link.'}</h2>
          <button className="btn btn-primary" type="button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero detail-hero">
        <div className="detail-hero__image">
          <img src={record.image || 'https://placehold.co/240x240'} alt={record.title} />
        </div>
        <div className="detail-hero__content">
          <p className="dashboard-hero__eyebrow">Placement Detail</p>
          <h2>{record.title}</h2>
          <p>{record.description}</p>
          <div className="detail-grid">
            <div>
              <strong>ID</strong>
              <span>#{record.id}</span>
            </div>
            <div>
              <strong>Category</strong>
              <span>{record.category}</span>
            </div>
            <div>
              <strong>Status</strong>
              <span>{record.status}</span>
            </div>
            <div>
              <strong>Package</strong>
              <span>{record.package}</span>
            </div>
            <div>
              <strong>Company</strong>
              <span>{record.company}</span>
            </div>
            <div>
              <strong>Location</strong>
              <span>{record.location}</span>
            </div>
            <div>
              <strong>Deadline</strong>
              <span>{record.deadline}</span>
            </div>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </section>
    </main>
  )
}

export default Details
