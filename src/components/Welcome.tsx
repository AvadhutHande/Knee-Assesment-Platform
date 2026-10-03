interface Props {
  onStart: () => void
}

export default function Welcome({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center fade-up">
        {/* Logo mark */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="38"
                stroke="#06b6d4"
                strokeWidth="1.5"
                opacity="0.4"
              />
              <circle
                cx="40"
                cy="40"
                r="28"
                stroke="#06b6d4"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Knee joint simplified */}
              <ellipse
                cx="40"
                cy="32"
                rx="10"
                ry="14"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              <ellipse
                cx="40"
                cy="52"
                rx="8"
                ry="10"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <line
                x1="40"
                y1="18"
                x2="40"
                y2="22"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="62"
                x2="40"
                y2="66"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Data dots */}
              <circle
                cx="22"
                cy="36"
                r="2"
                fill="#06b6d4"
                className="blink-dot"
              />
              <circle
                cx="58"
                cy="36"
                r="2"
                fill="#06b6d4"
                className="blink-dot"
                style={{ animationDelay: "0.4s" }}
              />
              <circle
                cx="22"
                cy="48"
                r="2"
                fill="#10b981"
                className="blink-dot"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="58"
                cy="48"
                r="2"
                fill="#10b981"
                className="blink-dot"
                style={{ animationDelay: "1.2s" }}
              />
            </svg>
          </div>
        </div>

        <p className="text-xs font-mono tracking-[0.3em] text-cyan-400 uppercase mb-3">
          Multimodal Assessment Prototype
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight">
          Knee Assessment
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1px rgba(6,182,212,0.8)" }}
          >
            Platform
          </span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          A multimodal biomechanical assessment combining wearable sensors,
          surface EMG, plantar pressure, bilateral temperature sensing, and
          computer vision to create an interpretable functional profile of the
          knee.
        </p>

        {/* Sensor badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            "IMU · Motion",
            "EMG · Muscle",
            "Pressure · Loading",
            "Temperature · Asymmetry",
            "Camera · Biomechanics",
            "Rules · Patterns",
          ].map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-full text-xs font-mono border border-slate-700 text-slate-400"
            >
              {s}
            </span>
          ))}
        </div>

        <button
          onClick={onStart}
          className="px-10 py-3.5 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #0891b2, #06b6d4)",
            boxShadow: "0 0 24px rgba(6,182,212,0.35)",
          }}
        >
          Begin Assessment
        </button>

        <p className="mt-6 text-xs text-slate-600">
          Unvalidated research prototype — not a diagnostic or medical device
        </p>
      </div>

      {/* Pipeline labels at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1 text-[10px] font-mono text-slate-700 tracking-wider">
        {[
          "SENSE",
          "→",
          "SYNC",
          "→",
          "PROCESS",
          "→",
          "EXTRACT",
          "→",
          "FUSE",
          "→",
          "ANALYZE",
          "→",
          "GUIDE",
        ].map((s, i) => (
          <span
            key={i}
            className={s === "→" ? "text-slate-800" : "text-slate-600"}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
