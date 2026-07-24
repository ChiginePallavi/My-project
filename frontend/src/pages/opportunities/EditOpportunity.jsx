import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOpportunityById, updateOpportunity } from '../../services/api'
import '../../styles/Dashboard.css'

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

function EditOpportunity() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getOpportunityById(id)
        const item = response.data || response.opportunity || response
        setFormData({
          title: item.title || '',
          company: item.company || '',
          category: item.category || '',
          status: item.status || 'Open',
          location: item.location || '',
          eligibility: item.eligibility || '',
          deadline: item.deadline || '',
          package: item.package || '',
          description: item.description || '',
          image: item.image || '',
        })
      } catch (err) {
        setError(err.message || 'Failed to load record details.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [id])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  if (loading && !formData.title) {
    return (
      <main className="page edit-page">
        <SkeletonCard />
      </main>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.company.trim() || !formData.category.trim() || !formData.description.trim()) {
      setError('Please complete the title, company, category, and description fields.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      await updateOpportunity(id, formData)
      setSuccessMsg('Record updated successfully.')
      setTimeout(() => {
        navigate('/dashboard', { state: { success: `Updated ${formData.title} successfully.` } })
      }, 800)
    } catch (err) {
      setError(err.message || 'Failed to update opportunity record.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <main className="page edit-page">
        <div className="loading-state">Loading opportunity details...</div>
      </main>
    )
  }

  return (
    <main className="page edit-page">
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
        <p className="dashboard-hero__eyebrow">Edit Opportunity</p>
        <h2>Update Placement Record #{id}</h2>
      </section>

      <section className="dashboard-section">
        {successMsg ? <div className="success-state">{successMsg}</div> : null}
        {error ? <div className="error-state">{error}</div> : null}

        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Title</span>
              <input name="title" value={formData.title} onChange={handleInputChange} />
            </label>
            <label className="form-field">
              <span>Company</span>
              <input name="company" value={formData.company} onChange={handleInputChange} />
            </label>
            <label className="form-field">
              <span>Category</span>
              <input name="category" value={formData.category} onChange={handleInputChange} />
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
              <input name="location" value={formData.location} onChange={handleInputChange} />
            </label>
            <label className="form-field">
              <span>Eligibility</span>
              <input name="eligibility" value={formData.eligibility} onChange={handleInputChange} />
            </label>
            <label className="form-field">
              <span>Deadline</span>
              <input name="deadline" value={formData.deadline} onChange={handleInputChange} />
            </label>
            <label className="form-field">
              <span>Package</span>
              <input name="package" value={formData.package} onChange={handleInputChange} />
            </label>
            <label className="form-field full-width">
              <span>Description</span>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
            </label>
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Update Record'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default EditOpportunity
