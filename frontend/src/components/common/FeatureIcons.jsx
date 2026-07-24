import React from 'react'
import './FeatureIcons.css'

function FeatureIcons() {
  const features = [
    {
      title: 'Real-Time Insights',
      description: 'Instant scores and analytics powered by student metrics.',
      icon: '📊',
    },
    {
      title: 'JWT Authentication',
      description: 'Secure login & role authorization for students and admins.',
      icon: '🛡️',
    },
    {
      title: 'Database Persistence',
      description: 'MongoDB Atlas integration storing opportunities and user data.',
      icon: '⚡',
    },
  ]

  return (
    <section className="features-grid">
      {features.map((feature) => (
        <article className="feature-card" key={feature.title}>
          <div className="feature-card__icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </section>
  )
}

export default FeatureIcons
