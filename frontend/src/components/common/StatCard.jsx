import React from 'react'
import './StatCard.css'

function StatCard({ title, value, detail, badge }) {
  return (
    <article className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {badge ? <span className="status-pill">{badge}</span> : null}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__detail">{detail}</div>
    </article>
  )
}

export default StatCard
