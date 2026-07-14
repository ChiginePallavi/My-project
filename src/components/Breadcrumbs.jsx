import { Link, useLocation } from 'react-router-dom'
import './Breadcrumbs.css'

function Breadcrumbs({ location }) {
  const pathnames = location.pathname.split('/').filter(Boolean)

  if (pathnames.length === 0) {
    return null
  }

  const crumbs = pathnames.map((segment, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return { to, label }
  })

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {crumbs.map((crumb, index) => (
        <span key={crumb.to}>
          <span className="breadcrumb-separator">/</span>
          {index === crumbs.length - 1 ? (
            <span className="breadcrumb-current">{crumb.label}</span>
          ) : (
            <Link to={crumb.to}>{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
