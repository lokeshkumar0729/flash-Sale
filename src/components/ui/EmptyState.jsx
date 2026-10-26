export default function EmptyState({ title, children, action }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
