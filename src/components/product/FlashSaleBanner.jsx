import { ArrowRight, Zap } from "lucide-react";

function FlashSaleBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-900 px-5 py-6 text-white shadow-sm sm:px-7">

      {/* Background decoration */}
      <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Zap
              size={20}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Limited Time Offer
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            MEGA FLASH SALE
          </h1>

          <p className="mt-1 text-sm text-slate-300">
            Up to <span className="font-bold text-yellow-400">70% OFF</span>
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">

          {[
            ["01", "Days"],
            ["23", "Hrs"],
            ["45", "Mins"],
            ["36", "Secs"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-bold backdrop-blur-sm sm:h-12 sm:w-12">
                {value}
              </div>

              <span className="mt-1 block text-[9px] text-slate-400">
                {label}
              </span>
            </div>
          ))}

          <button className="ml-2 hidden items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:flex">
            Shop Now
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default FlashSaleBanner;