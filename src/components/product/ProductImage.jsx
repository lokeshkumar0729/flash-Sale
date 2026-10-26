import { useState } from 'react'
import { ImageOff } from 'lucide-react'

/** Shows the image, or a neutral placeholder if the URL is missing or fails to load. */
export default function ProductImage({ src, alt, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-8 w-8" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={`object-cover ${className}`} />
}
