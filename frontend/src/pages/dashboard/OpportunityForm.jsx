import React from 'react'

function OpportunityForm({ formData, handleInputChange, handleSubmit, loading }) {
  return (
    <form className="crud-form" onSubmit={handleSubmit}>
      <div className="section-heading compact">
        <div>
          <p className="dashboard-hero__eyebrow">Add New Opportunity</p>
          <h4>Create a new placement record using the backend API</h4>
        </div>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Frontend Developer"
          />
        </label>
        <label className="form-field">
          <span>Company</span>
          <input
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Acme Labs"
          />
        </label>
        <label className="form-field">
          <span>Category</span>
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Product"
          />
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
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Remote"
          />
        </label>
        <label className="form-field">
          <span>Eligibility</span>
          <input
            name="eligibility"
            value={formData.eligibility}
            onChange={handleInputChange}
            placeholder="CGPA 7.5+"
          />
        </label>
        <label className="form-field">
          <span>Deadline</span>
          <input
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            placeholder="2026-08-31"
          />
        </label>
        <label className="form-field">
          <span>Package</span>
          <input
            name="package"
            value={formData.package}
            onChange={handleInputChange}
            placeholder="12 LPA"
          />
        </label>
        <label className="form-field full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the opportunity"
            rows="3"
          />
        </label>
        <label className="form-field full-width">
          <span>Image URL</span>
          <input
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Record'}
        </button>
      </div>
    </form>
  )
}

export default OpportunityForm
