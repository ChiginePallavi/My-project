import './FeatureIcons.css'
import { useNavigate } from 'react-router-dom'

function Icon({ svg, title, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick && onClick()
    }
  }

  return (
    <div className="feature-icon" role="button" tabIndex={0} onClick={onClick} onKeyDown={handleKeyDown}>
      <div className="feature-icon__svg" aria-hidden>
        {svg}
      </div>
      <div className="feature-icon__title">{title}</div>
    </div>
  )
}

export default function FeatureIcons() {
  const navigate = useNavigate()

  const icons = [
    {
      title: 'Student Profiles',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#60A5FA" />
          <path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      title: 'Readiness Score',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h6l2 4 6-8 4 8" stroke="#34D399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="10" stroke="#86EFAC" strokeWidth="0.8" />
        </svg>
      ),
      onClick: () => navigate('/dashboard/overview'),
    },
    {
      title: 'Open Opportunities',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="12" rx="2" fill="#FDE68A" />
          <path d="M8 10h8M8 14h5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => navigate('/dashboard'),
    },
    {
      title: 'Secure Data',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 11v2" stroke="#60A5FA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 10V8a5 5 0 10-10 0v2" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="11" width="16" height="9" rx="2" stroke="#BFDBFE" strokeWidth="0.9" />
        </svg>
      ),
      onClick: () => navigate('/about'),
    },
  ]

  return (
    <section className="feature-icons">
      {icons.map((i) => (
        <Icon key={i.title} svg={i.svg} title={i.title} onClick={i.onClick} />
      ))}
    </section>
  )
}
