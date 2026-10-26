import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useToast } from '../context/toast-context'
import { useWishlist } from '../context/wishlist-context'
import { useQuery } from '../hooks/useQuery'
import ProductCard from '../components/product/ProductCard'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import Spinner from '../components/ui/Spinner'
import { primaryButton, secondaryButton } from '../components/ui/styles'
import { useAuth } from '../context/auth-context'

export default function Wishlist() {
  const { user } = useAuth()
  const wishlist = useWishlist()
  const toast = useToast()
  const items = useQuery(() => api.wishlist.list(), [])

  if (user.role !== 'CUSTOMER') {
    return <EmptyState title="Wishlists are for customer accounts" />
  }
  if (items.error && !items.data) return <ErrorNotice error={items.error} onRetry={items.reload} />
  if (!items.data) return <Spinner />

  const remove = async (productId) => {
    try {
      await wishlist.toggle(productId)
      items.reload()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold">Wishlist</h1>
      {items.data.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white">
          <EmptyState title="Nothing saved yet" action={<Link to="/" className={primaryButton}>Find something you like</Link>}>
            Tap the heart on any product to keep it here, and watch for its flash deal.
          </EmptyState>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.data.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} />
              <button className={secondaryButton} onClick={() => remove(p.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
