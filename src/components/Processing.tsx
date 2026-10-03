import { useState, useEffect } from "react"

interface Props {
  onComplete: () => void
}

const STEPS = [
  { label: "Quality check & signal validation", duration: 500 },
  { label: "Sensor calibration correction", duration: 600 },
  { label: "Time synchronization across modalities", duration: 700 },
  { label: "Band-pass filtering · Noise rejection", duration: 600 },
  { label: "IMU feature extraction · ROM · Gait metrics", duration: 700 },
  { label: "Pressure distribution · CoP · Load asymmetry", duration: 600 },
  { label: "EMG envelope · RMS · Activation symmetry", duration: 700 },
  { label: "Thermal asymmetry · Rate-of-change", duration: 500 },
  { label: "Pose estimation · Valgus/varus · Squat depth", duration: 600 },
  { label: "Multimodal sensor fusion · Feature vector", duration: 800 },
  { label: "Movement model · Loading model inference", duration: 700 },
  { label: "Muscle activation model · Symptom model", duration: 700 },
  { label: "Configured pattern rules · Match calculation", duration: 800 },
  { label: "Safety engine · Red flag evaluation", duration: 600 },
  { label: "Generating interpretable report", duration: 500 },
]

export default function Processing({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let idx = 0
    let totalDelay = 0

    STEPS.forEach((step, i) => {
      totalDelay += step.duration
      setTimeout(() => {
        setCurrentStep(i + 1)
        if (i === STEPS.length - 1) {
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 800)
          }, 400)
        }
      }, totalDelay)
    })
  }, [])

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full fade-up">
        {/* Central animation */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#1e293b"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#06b6d4"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50px 50px",
                  transition: "stroke-dashoffset 0.5s ease",
                }}
              />
              <text
                x="50"
                y="56"
                textAnchor="middle"
                className="font-mono"
                fontSize="18"
                fill="#06b6d4"
                fontWeight="600"
              >
                {Math.round(progress)}%
              </text>
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          {done ? (
            <>
              <div className="text-4xl mb-3">✓</div>
              <h2 className="text-xl font-semibold text-white">
                Analysis Complete
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Generating your report…
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">
                Processing Sensor Data
              </h2>
              <p className="text-slate-400 text-sm">
                Multimodal rules pipeline running…
              </p>
            </>
          )}
        </div>

        {/* Step list */}
        <div className="space-y-1.5 max-h-80 overflow-hidden">
          {STEPS.map((step, i) => {
            const state =
              i < currentStep
                ? "done"
                : i === currentStep
                  ? "active"
                  : "pending"
            return (
              <div
                key={i}
                className="flex items-center gap-3 transition-all duration-300"
                style={{ opacity: state === "pending" ? 0.25 : 1 }}
              >
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor:
                      state === "done"
                        ? "#10b981"
                        : state === "active"
                          ? "rgba(6,182,212,0.2)"
                          : "#1e293b",
                    border:
                      state === "active"
                        ? "1.5px solid #06b6d4"
                        : "1.5px solid transparent",
                    color: state === "done" ? "#fff" : "#06b6d4",
                  }}
                >
                  {state === "done" ? (
                    "✓"
                  ) : state === "active" ? (
                    <span className="blink-dot">·</span>
                  ) : (
                    ""
                  )}
                </div>
                <span
                  className="text-xs font-mono"
                  style={{
                    color:
                      state === "done"
                        ? "#64748b"
                        : state === "active"
                          ? "#e2e8f0"
                          : "#334155",
                  }}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Pipeline labels */}
        <div className="mt-8 flex justify-center gap-1 text-[10px] font-mono text-slate-700 tracking-wider flex-wrap">
          {[
            "IMU",
            "·",
            "PRESSURE",
            "·",
            "EMG",
            "·",
            "TEMP",
            "·",
            "CAMERA",
            "·",
            "QUESTIONNAIRE",
            "→",
            "RULES",
          ].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
