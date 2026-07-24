import React from 'react'
import Button from '../common/Button'
import './HeroSection.css'

function HeroSection({ title, subtitle, highlight, primaryAction, secondaryAction, onPrimaryAction, onSecondaryAction }) {
  return (
    <section className="hero-section">
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">{highlight}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="hero-section__actions">
          {primaryAction && <Button label={primaryAction} onClick={onPrimaryAction} variant="primary" />}
          {secondaryAction && <Button label={secondaryAction} onClick={onSecondaryAction} variant="secondary" />}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
