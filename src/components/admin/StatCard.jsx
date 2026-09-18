function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-indigo-100 text-indigo-600",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>

      </div>
    </div>
  );
}

export default StatCard;