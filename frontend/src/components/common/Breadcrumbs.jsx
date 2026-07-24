import { Link, useLocation } from 'react-router-dom'
import './Breadcrumbs.css'

function Breadcrumbs({ location: propLocation }) {
  const currentPath = propLocation?.pathname || useLocation().pathname
  const pathnames = currentPath.split('/').filter(Boolean)

  if (pathnames.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const formattedLabel = value.replace(/-/g, ' ')

          return (
            <li key={to}>
              <span className="separator">/</span>
              {isLast ? (
                <span className="current" aria-current="page">
                  {formattedLabel}
                </span>
              ) : (
                <Link to={to}>{formattedLabel}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
