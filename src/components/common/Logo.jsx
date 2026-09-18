import { Zap } from "lucide-react";

function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2">
      <Zap
        size={27}
        strokeWidth={2.5}
        className="fill-yellow-400 text-yellow-400"
      />

      <span
        className={`text-xl font-extrabold tracking-tight ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        FLASHSALE
      </span>
    </div>
  );
}

export default Logo;