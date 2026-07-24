import { NavLink } from 'react-router-dom'
import { getAuthSidebarItems, guestSidebarItems } from '../../config/navigation'
import './Sidebar.css'

function Sidebar({ isLoggedIn, activeUser }) {
  const items = isLoggedIn ? getAuthSidebarItems(activeUser) : guestSidebarItems

  return (
    <aside className="sidebar">
      <h2>Quick Navigation</h2>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar__item${isActive ? ' active' : ''}`}
            >
              <span>{item.title}</span>
              <small>{item.description}</small>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
