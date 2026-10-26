import { Heart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { useToast } from '../../context/toast-context'
import { useWishlist } from '../../context/wishlist-context'

export default function WishlistButton({ productId, className = '' }) {
  const { user } = useAuth()
  const wishlist = useWishlist()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const wished = wishlist.has(productId)

  const onClick = async (e) => {
    e.preventDefault() // the button sits inside a product link
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } })
      return
    }
    if (user.role !== 'CUSTOMER') {
      toast.error('Wishlists are for customer accounts')
      return
    }
    try {
      const nowWished = await wishlist.toggle(productId)
      toast.success(nowWished ? 'Saved to your wishlist' : 'Removed from your wishlist')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={wished}
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition hover:scale-105 ${className}`}
    >
      <Heart className={`h-[18px] w-[18px] ${wished ? 'fill-brand text-brand' : 'text-slate-600'}`} />
    </button>
  )
}
