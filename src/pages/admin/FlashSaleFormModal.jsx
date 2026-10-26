import { useState } from 'react'
import { api } from '../../api/client'
import { useToast } from '../../context/toast-context'
import { formatPrice, isoToLocalInput, localInputToIso } from '../../lib/format'
import Field from '../../components/ui/Field'
import Modal from '../../components/ui/Modal'
import { inputClass, primaryButton, secondaryButton } from '../../components/ui/styles'

export default function FlashSaleFormModal({ products, onClose, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState(() => {
    const now = Date.now()
    return {
      productId: '',
      salePrice: '',
      totalQuantity: 20,
      perUserLimit: 2,
      startsAt: isoToLocalInput(new Date(now).toISOString()),
      endsAt: isoToLocalInput(new Date(now + 24 * 3600 * 1000).toISOString()),
    }
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const product = products.find((p) => String(p.id) === form.productId)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const found = {}
    if (!form.productId) found.productId = 'Choose a product'
    if (!(Number(form.salePrice) > 0)) found.salePrice = 'Enter the flash price'
    else if (product && Number(form.salePrice) >= Number(product.price)) found.salePrice = `Must be lower than the regular price (${formatPrice(product.price)})`
    if (!Number.isInteger(Number(form.totalQuantity)) || Number(form.totalQuantity) < 1) found.totalQuantity = 'At least 1 unit'
    else if (product && Number(form.totalQuantity) > product.stock) found.totalQuantity = `Only ${product.stock} in stock`
    if (!Number.isInteger(Number(form.perUserLimit)) || Number(form.perUserLimit) < 1 || Number(form.perUserLimit) > 10) found.perUserLimit = 'Between 1 and 10'
    else if (Number(form.perUserLimit) > Number(form.totalQuantity)) found.perUserLimit = 'Cannot exceed the sale quantity'
    if (!form.startsAt) found.startsAt = 'Start time is required'
    if (!form.endsAt) found.endsAt = 'End time is required'
    else if (form.startsAt && form.endsAt <= form.startsAt) found.endsAt = 'Must be after the start'
    return found
  }

  const submit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    try {
      await api.admin.flashSales.create({
        productId: Number(form.productId),
        salePrice: Number(form.salePrice),
        totalQuantity: Number(form.totalQuantity),
        perUserLimit: Number(form.perUserLimit),
        startsAt: localInputToIso(form.startsAt),
        endsAt: localInputToIso(form.endsAt),
      })
      toast.success('Flash sale scheduled')
      onSaved()
    } catch (err) {
      if (Object.keys(err.fieldErrors ?? {}).length) setErrors(err.fieldErrors)
      else toast.error(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal
      title="New flash sale"
      onClose={onClose}
      size="max-w-2xl"
      footer={
        <>
          <button type="button" className={secondaryButton} onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" form="sale-form" className={primaryButton} disabled={busy}>{busy ? 'Scheduling…' : 'Schedule sale'}</button>
        </>
      }
    >
      <form id="sale-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Product" htmlFor="s-product" error={errors.productId} hint={product ? `Regular price ${formatPrice(product.price)} · ${product.stock} in stock` : undefined} className="sm:col-span-2">
          <select id="s-product" autoFocus className={inputClass} value={form.productId} onChange={set('productId')}>
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Flash price (₹)" htmlFor="s-price" error={errors.salePrice}>
          <input id="s-price" type="number" min="0" step="0.01" className={inputClass} value={form.salePrice} onChange={set('salePrice')} />
        </Field>
        <Field label="Units on sale" htmlFor="s-qty" error={errors.totalQuantity} hint="Taken out of the product's stock.">
          <input id="s-qty" type="number" min="1" className={inputClass} value={form.totalQuantity} onChange={set('totalQuantity')} />
        </Field>
        <Field label="Limit per customer" htmlFor="s-limit" error={errors.perUserLimit}>
          <input id="s-limit" type="number" min="1" max="10" className={inputClass} value={form.perUserLimit} onChange={set('perUserLimit')} />
        </Field>
        <span className="hidden sm:block" />
        <Field label="Starts" htmlFor="s-start" error={errors.startsAt}>
          <input id="s-start" type="datetime-local" className={inputClass} value={form.startsAt} onChange={set('startsAt')} />
        </Field>
        <Field label="Ends" htmlFor="s-end" error={errors.endsAt}>
          <input id="s-end" type="datetime-local" className={inputClass} value={form.endsAt} onChange={set('endsAt')} />
        </Field>
      </form>
    </Modal>
  )
}
