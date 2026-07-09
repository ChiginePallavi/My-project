import Button from './Button'
import './HeroSection.css'

function HeroSection({ title, subtitle, highlight, primaryAction, secondaryAction, onPrimaryAction, onSecondaryAction }) {
  return (
    <section className="hero-section">
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">{highlight}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="hero-section__actions">
          <Button label={primaryAction} variant="primary" onClick={onPrimaryAction} />
          <Button label={secondaryAction} variant="secondary" onClick={onSecondaryAction} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
