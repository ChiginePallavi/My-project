import './Skeleton.css'

export function SkeletonText({ width = '100%', height = '1rem', className = '' }) {
  return <div className={`skeleton skeleton-text ${className}`} style={{ width, height }} />
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__top">
        <div className="skeleton skeleton-title" style={{ width: '50%' }} />
        <div className="skeleton skeleton-badge" />
      </div>
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
      <div className="skeleton skeleton-text" style={{ width: '75%' }} />
      <div className="skeleton-card__top" style={{ marginTop: '0.5rem' }}>
        <div className="skeleton skeleton-badge" style={{ width: '70px' }} />
        <div className="skeleton skeleton-badge" style={{ width: '70px' }} />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-table__row">
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonCard
