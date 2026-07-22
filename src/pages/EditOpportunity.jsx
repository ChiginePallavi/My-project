import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOpportunityById, updateOpportunity } from '../services/api'
import '../styles/Dashboard.css'

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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getOpportunityById(id)
        const record = response.data

        setFormData({
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
      } catch (err) {
        setError(err.message || 'Unable to load the requested record.')
      } finally {
        setLoading(false)
      }
    }

    loadRecord()
  }, [id])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateOpportunity(id, {
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
      })
      setSuccess('Record updated successfully.')
      navigate('/dashboard', { state: { success: 'Record updated successfully.' } })
    } catch (err) {
      setError(err.message || 'Unable to update the record.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="page dashboard-page">
        <section className="dashboard-hero">
          <p className="dashboard-hero__eyebrow">Loading record</p>
          <h2>Please wait while the record is loaded.</h2>
        </section>
      </main>
    )
  }

  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Edit Opportunity</p>
          <h2>Update the record and save changes to MongoDB.</h2>
        </div>
        <p>Use the form below to edit the opportunity details and submit the update.</p>
      </section>

      <section className="dashboard-section">
        {success ? <div className="success-state">{success}</div> : null}
        {error ? <div className="error-state">{error}</div> : null}

        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Title</span>
              <input name="title" value={formData.title} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Company</span>
              <input name="company" value={formData.company} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Category</span>
              <input name="category" value={formData.category} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Status</span>
              <select name="status" value={formData.status} onChange={handleInputChange} disabled={saving}>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label className="form-field">
              <span>Location</span>
              <input name="location" value={formData.location} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Eligibility</span>
              <input name="eligibility" value={formData.eligibility} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Deadline</span>
              <input name="deadline" value={formData.deadline} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field">
              <span>Package</span>
              <input name="package" value={formData.package} onChange={handleInputChange} disabled={saving} />
            </label>
            <label className="form-field full-width">
              <span>Description</span>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" disabled={saving} />
            </label>
            <label className="form-field full-width">
              <span>Image URL</span>
              <input name="image" value={formData.image} onChange={handleInputChange} disabled={saving} />
            </label>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default EditOpportunity
