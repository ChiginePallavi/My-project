import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOpportunityById } from '../../services/api'
import '../../styles/Dashboard.css'

import { SkeletonCard, SkeletonText } from '../../components/common/Skeleton'

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getOpportunityById(id)
        const item = response.data || response.opportunity || response
        setRecord(item)
      } catch (err) {
        setError(err.message || 'Unable to load record details from backend.')
        setRecord(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [id])

  if (loading) {
    return (
      <main className="page details-page">
        <SkeletonCard />
      </main>
    )
  }

  if (error || !record) {
    return (
      <main className="page details-page">
        <section className="dashboard-hero">
          <p className="dashboard-hero__eyebrow">Record Error</p>
          <h2>Record Not Found</h2>
          <p>{error || 'The requested opportunity record does not exist.'}</p>
          <div className="button-row" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" type="button" onClick={() => navigate('/dashboard')}>
              ← Back to Opportunities
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page details-page">
      <div style={{ marginBottom: '1rem' }}>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ← Back to Opportunities
        </button>
      </div>

      <section className="dashboard-hero">
        <div>
          <span className="status-pill">{record.category}</span>
          <span className="status-pill subtle" style={{ marginLeft: '0.5rem' }}>
            {record.status}
          </span>
          <h2 style={{ marginTop: '0.5rem' }}>{record.title}</h2>
          <p className="meta-line">
            {record.company} • {record.location}
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="details-grid">
          <div className="details-card">
            <h4>Eligibility & Criteria</h4>
            <p>{record.eligibility || 'Open to eligible final year students.'}</p>
          </div>
          <div className="details-card">
            <h4>Deadline & Package</h4>
            <p>
              Application Deadline: {record.deadline || 'N/A'}
              <br />
              Salary Package: {record.package || 'Competitive'}
            </p>
          </div>
        </div>

        <div className="details-card full-width" style={{ marginTop: '1rem' }}>
          <h4>Opportunity Description</h4>
          <p>{record.description}</p>
        </div>
      </section>
    </main>
  )
}

export default Details
