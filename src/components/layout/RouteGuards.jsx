import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import Spinner from '../ui/Spinner'

/** Requires a signed-in user, optionally with a specific role. */
export default function RequireAuth({ role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (role && user.role !== role) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace />
  return <Outlet />
}
