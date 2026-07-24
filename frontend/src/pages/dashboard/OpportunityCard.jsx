import React from 'react'

function OpportunityCard({ record, isAdmin, loading, handleView, handleEdit, handleDelete }) {
  return (
    <article className="opportunity-card">
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
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleView(record)}
          disabled={loading}
        >
          View Details
        </button>
        {isAdmin ? (
          <>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => handleEdit(record)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => handleDelete(record)}
              disabled={loading}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}

export default OpportunityCard
