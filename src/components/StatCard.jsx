import './StatCard.css'

function StatCard({ title, value, detail, badge }) {
  return (
    <article className="stat-card">
      <span className="stat-card__badge">{badge}</span>
      <h3>{title}</h3>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__detail">{detail}</p>
    </article>
  )
}

export default StatCard
