import { useState } from 'react'
import { api } from '../../api/client'
import { useToast } from '../../context/toast-context'
import Field from '../../components/ui/Field'
import Modal from '../../components/ui/Modal'
import { inputClass, primaryButton, secondaryButton } from '../../components/ui/styles'

const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean)

export default function ProductFormModal({ product, onClose, onSaved }) {
  const toast = useToast()
  const editing = Boolean(product)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    originalPrice: product?.originalPrice ?? '',
    stock: product?.stock ?? 0,
    images: (product?.images ?? []).join('\n'),
    features: (product?.features ?? []).join('\n'),
    active: product?.active ?? true,
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const found = {}
    if (!form.name.trim()) found.name = 'Name is required'
    if (!form.category.trim()) found.category = 'Category is required'
    if (!(Number(form.price) > 0)) found.price = 'Price must be above zero'
    if (!(Number(form.originalPrice) > 0)) found.originalPrice = 'Original price must be above zero'
    else if (Number(form.originalPrice) < Number(form.price)) found.originalPrice = 'Original price cannot be lower than the price'
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) found.stock = 'Stock must be a whole number, 0 or more'
    if (lines(form.images).length === 0) found.images = 'Add at least one image URL'
    return found
  }

  const submit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    const body = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      stock: Number(form.stock),
      images: lines(form.images),
      features: lines(form.features),
      active: form.active,
    }
    setBusy(true)
    try {
      if (editing) await api.admin.products.update(product.id, body)
      else await api.admin.products.create(body)
      toast.success(editing ? 'Product updated' : 'Product created')
      onSaved()
    } catch (err) {
      if (Object.keys(err.fieldErrors ?? {}).length) setErrors(err.fieldErrors)
      else toast.error(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal
      title={editing ? 'Edit product' : 'New product'}
      onClose={onClose}
      size="max-w-2xl"
      footer={
        <>
          <button type="button" className={secondaryButton} onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" form="product-form" className={primaryButton} disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="p-name" error={errors.name} className="sm:col-span-2">
          <input id="p-name" autoFocus className={inputClass} value={form.name} onChange={set('name')} maxLength={150} />
        </Field>
        <Field label="Category" htmlFor="p-category" error={errors.category}>
          <input id="p-category" className={inputClass} value={form.category} onChange={set('category')} maxLength={60} placeholder="e.g. Electronics" />
        </Field>
        <Field label="Stock" htmlFor="p-stock" error={errors.stock}>
          <input id="p-stock" type="number" min="0" className={inputClass} value={form.stock} onChange={set('stock')} />
        </Field>
        <Field label="Selling price (₹)" htmlFor="p-price" error={errors.price}>
          <input id="p-price" type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={set('price')} />
        </Field>
        <Field label="Original price / MRP (₹)" htmlFor="p-original" error={errors.originalPrice}>
          <input id="p-original" type="number" min="0" step="0.01" className={inputClass} value={form.originalPrice} onChange={set('originalPrice')} />
        </Field>
        <Field label="Image URLs" htmlFor="p-images" error={errors.images} hint="One per line. The first one is the main image." className="sm:col-span-2">
          <textarea id="p-images" rows={3} className={`${inputClass} resize-none font-mono text-xs`} value={form.images} onChange={set('images')} />
        </Field>
        <Field label="Highlights (optional)" htmlFor="p-features" error={errors.features} hint="One per line." className="sm:col-span-2">
          <textarea id="p-features" rows={3} className={`${inputClass} resize-none`} value={form.features} onChange={set('features')} />
        </Field>
        <Field label="Description (optional)" htmlFor="p-description" error={errors.description} className="sm:col-span-2">
          <textarea id="p-description" rows={3} className={`${inputClass} resize-none`} value={form.description} onChange={set('description')} maxLength={2000} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
          <input type="checkbox" className="h-4 w-4 accent-brand" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Visible in the store
        </label>
      </form>
    </Modal>
  )
}
