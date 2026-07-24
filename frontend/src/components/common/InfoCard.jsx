import React from 'react'
import './InfoCard.css'

function InfoCard({ title, items = [] }) {
  return (
    <article className="info-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default InfoCard
