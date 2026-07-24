export const guestNavLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/register', label: 'Register' },
  { to: '/login', label: 'Login' },
]

export const authNavLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/profile', label: 'My Profile' },
  { to: '/about', label: 'About' },
]

export const guestSidebarItems = [
  {
    to: '/',
    title: 'Portal Overview',
    description: 'Explore readiness insights & opportunities.',
  },
  {
    to: '/login',
    title: 'Sign In',
    description: 'Access your account & profile.',
  },
  {
    to: '/register',
    title: 'Create Account',
    description: 'Register with resume and profile avatar.',
  },
  {
    to: '/about',
    title: 'About Platform',
    description: 'Learn about placement intelligence features.',
  },
]

export const getAuthSidebarItems = (activeUser) => [
  {
    to: '/dashboard/overview',
    title: 'Placement Records',
    description: 'Browse & search placement opportunities.',
  },
  {
    to: '/dashboard/profile',
    title: 'My Profile',
    description: `Logged in as ${activeUser?.displayName || 'User'} (${activeUser?.role || 'student'}).`,
  },
  {
    to: '/registered-details',
    title: 'Account Summary',
    description: 'View full registration summary details.',
  },
  {
    to: '/dashboard/settings',
    title: 'Account Settings',
    description: 'Manage alerts & notification preferences.',
  },
]
