import { useState } from 'react'
import { EyeOff, Pencil, Plus, Search } from 'lucide-react'
import { api } from '../../api/client'
import { useToast } from '../../context/toast-context'
import { useDebounce } from '../../hooks/useDebounce'
import { useQuery } from '../../hooks/useQuery'
import { formatPrice } from '../../lib/format'
import ProductImage from '../../components/product/ProductImage'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorNotice from '../../components/ui/ErrorNotice'
import Pagination from '../../components/ui/Pagination'
import { inputClass, primaryButton } from '../../components/ui/styles'
import ProductFormModal from './ProductFormModal'

const PAGE_SIZE = 10

export default function AdminProducts() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const q = useDebounce(search)
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null) // 'new' | product | null
  const [hiding, setHiding] = useState(null)
  const [busy, setBusy] = useState(false)

  const products = useQuery(() => api.admin.products.list({ q, page, size: PAGE_SIZE }), [q, page])
  const rows = products.data?.content ?? []

  const hide = async () => {
    setBusy(true)
    try {
      await api.admin.products.deactivate(hiding.id)
      toast.success(`${hiding.name} is now hidden from the store`)
      setHiding(null)
      products.reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Products</h1>
        <button className={primaryButton} onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input aria-label="Search products" className={`${inputClass} pl-10`} placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} />
      </div>

      {products.error && <ErrorNotice error={products.error} onRetry={products.reload} />}

      {!products.error && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-busy={products.loading}>
          {products.data && rows.length === 0 ? (
            <EmptyState title={q ? 'No products match your search' : 'No products yet'} />
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full min-w-[46rem] text-left text-sm ${products.loading ? 'opacity-60' : ''}`}>
                <thead className="border-b border-line bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 text-right font-semibold">Price</th>
                    <th className="px-4 py-3 text-right font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage src={p.images[0]} alt="" className="h-11 w-11 shrink-0 rounded-lg" />
                          <span className="line-clamp-1 font-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPrice(p.price)}
                        {p.flashSale?.status === 'LIVE' && <span className="ml-2 rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand">Flash</span>}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold tabular-nums ${p.stock < 10 ? 'text-brand' : ''}`}>{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {p.active ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button aria-label={`Edit ${p.name}`} title="Edit" onClick={() => setEditing(p)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                            <Pencil className="h-4 w-4" />
                          </button>
                          {p.active && (
                            <button aria-label={`Hide ${p.name}`} title="Hide from store" onClick={() => setHiding(p)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                              <EyeOff className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {products.data && <Pagination page={products.data.page} totalPages={products.data.totalPages} totalElements={products.data.totalElements} size={PAGE_SIZE} onPage={setPage} />}

      {editing && (
        <ProductFormModal
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); products.reload() }}
        />
      )}
      {hiding && (
        <ConfirmDialog
          title={`Hide ${hiding.name}?`}
          message="It disappears from the store, carts and wishlists. Past orders keep working. You can show it again by editing the product."
          confirmLabel="Hide product"
          busy={busy}
          onConfirm={hide}
          onCancel={() => setHiding(null)}
        />
      )}
    </div>
  )
}
