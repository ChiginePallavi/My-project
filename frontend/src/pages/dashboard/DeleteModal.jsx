import React from 'react'

function DeleteModal({ deleteTarget, confirmDelete, setDeleteTarget }) {
  if (!deleteTarget) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>Delete this record?</h3>
        <p>This action removes {deleteTarget.title} from MongoDB Atlas immediately.</p>
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
  )
}

export default DeleteModal
