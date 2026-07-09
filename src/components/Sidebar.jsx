import './Sidebar.css'

function Sidebar({ currentPage, onNavigate }) {
  const items = [
    {
      id: 'home',
      title: 'Overview',
      description: 'Welcome to the predictor experience.',
    },
    {
      id: 'dashboard',
      title: 'Scoreboard',
      description: 'Track progress and eligibility insights.',
    },
    {
      id: 'register',
      title: 'Register',
      description: 'Complete your application with validation.',
    },
    {
      id: 'login',
      title: 'Login',
      description: 'Sign in to access your eligibility details.',
    },
  ]

  return (
    <aside className="sidebar">
      <h2>Project Sections</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={`sidebar__item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span>{item.title}</span>
              <small>{item.description}</small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
