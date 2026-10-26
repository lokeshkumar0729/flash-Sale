import { useState } from 'react'
import { Plus, Square } from 'lucide-react'
import { api } from '../../api/client'
import { useToast } from '../../context/toast-context'
import { useQuery } from '../../hooks/useQuery'
import { formatDateTime, formatPrice } from '../../lib/format'
import ProductImage from '../../components/product/ProductImage'
import ClaimedBar from '../../components/ui/ClaimedBar'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorNotice from '../../components/ui/ErrorNotice'
import Pagination from '../../components/ui/Pagination'
import { primaryButton } from '../../components/ui/styles'
import FlashSaleFormModal from './FlashSaleFormModal'

const PAGE_SIZE = 10

const STATUS = {
  LIVE: 'bg-emerald-100 text-emerald-800',
  UPCOMING: 'bg-sky-100 text-sky-800',
  SOLD_OUT: 'bg-amber-100 text-amber-800',
  ENDED: 'bg-slate-200 text-slate-600',
}
const LABEL = { LIVE: 'Live', UPCOMING: 'Upcoming', SOLD_OUT: 'Sold out', ENDED: 'Ended' }

export default function AdminFlashSales() {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [creating, setCreating] = useState(false)
  const [ending, setEnding] = useState(null)
  const [busy, setBusy] = useState(false)

  const sales = useQuery(() => api.admin.flashSales.list({ page, size: PAGE_SIZE }), [page])
  const products = useQuery(() => api.admin.products.list({ size: 50 }), [])
  const rows = sales.data?.content ?? []

  const end = async () => {
    setBusy(true)
    try {
      await api.admin.flashSales.end(ending.id)
      toast.success('Flash sale ended')
      setEnding(null)
      sales.reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Flash sales</h1>
        <button className={primaryButton} onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New flash sale
        </button>
      </div>

      {sales.error && <ErrorNotice error={sales.error} onRetry={sales.reload} />}

      {!sales.error && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-busy={sales.loading}>
          {sales.data && rows.length === 0 ? (
            <EmptyState title="No flash sales yet">Schedule one and it appears on the storefront the moment it starts.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full min-w-[56rem] text-left text-sm ${sales.loading ? 'opacity-60' : ''}`}>
                <thead className="border-b border-line bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="w-48 px-4 py-3 font-semibold">Claimed</th>
                    <th className="px-4 py-3 font-semibold">Window</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage src={s.productImage} alt="" className="h-11 w-11 shrink-0 rounded-lg" />
                          <span className="line-clamp-1 font-semibold">{s.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        <span className="font-bold">{formatPrice(s.salePrice)}</span>
                        <span className="ml-2 text-slate-400 line-through">{formatPrice(s.regularPrice)}</span>
                        <p className="text-xs text-slate-500">Limit {s.perUserLimit} each</p>
                      </td>
                      <td className="px-4 py-3">
                        <ClaimedBar sold={s.sold} total={s.totalQuantity} compact />
                        <p className="mt-1 text-xs tabular-nums text-slate-500">{s.sold} / {s.totalQuantity} units</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {formatDateTime(s.startsAt)}
                        <br />→ {formatDateTime(s.endsAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[s.status]}`}>{LABEL[s.status]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          {s.status !== 'ENDED' && (
                            <button onClick={() => setEnding(s)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                              <Square className="h-3.5 w-3.5 fill-current" /> End now
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

      {sales.data && <Pagination page={sales.data.page} totalPages={sales.data.totalPages} totalElements={sales.data.totalElements} size={PAGE_SIZE} onPage={setPage} />}

      {creating && (
        <FlashSaleFormModal
          products={(products.data?.content ?? []).filter((p) => p.active)}
          onClose={() => setCreating(false)}
          onSaved={() => { setCreating(false); sales.reload() }}
        />
      )}
      {ending && (
        <ConfirmDialog
          title={`End the ${ending.productName} sale?`}
          message="The flash price stops immediately and the product returns to its regular price. Orders already placed keep the price they paid."
          confirmLabel="End sale"
          busy={busy}
          onConfirm={end}
          onCancel={() => setEnding(null)}
        />
      )}
    </div>
  )
}
