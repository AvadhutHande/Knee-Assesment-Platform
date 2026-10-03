import type { InputMode } from "../types"

interface Props {
  onSelect: (mode: InputMode) => void
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
          Step 2 of 7
        </p>
        <h2 className="text-2xl font-semibold text-white">Data Input Mode</h2>
        <p className="text-slate-400 text-sm mt-1">
          Choose how sensor data will be collected for this session
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hardware Mode */}
        <button
          onClick={() => onSelect("hardware")}
          className="group relative flex flex-col gap-4 p-7 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:border-cyan-500"
          style={{
            borderColor: "#1e293b",
            backgroundColor: "rgba(15,23,42,0.8)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(6,182,212,0.05), transparent 70%)",
            }}
          />

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h2M17 12h2M12 5v2M12 17v2"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M16.3 7.7l1.4-1.4M6.3 17.7l1.4-1.4"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">
                Hardware Mode
              </h3>
              <p className="text-xs text-cyan-500 font-mono">
                BLE / USB Connection
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            Connect physical sensor hardware via Bluetooth or USB. Live data
            streams from IMU, EMG, pressure insoles, temperature sensors, and
            camera.
          </p>

          <div className="space-y-1.5">
            {[
              { icon: "◉", label: "Left IMU (Thigh)", status: "Searching…" },
              { icon: "◉", label: "Right IMU (Shin)", status: "Searching…" },
              { icon: "◉", label: "Pressure Insoles", status: "Searching…" },
              { icon: "◉", label: "EMG Electrodes", status: "Searching…" },
              { icon: "◉", label: "Temperature Sensors", status: "Searching…" },
              { icon: "◉", label: "Camera (Pose Est.)", status: "Searching…" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span style={{ color: "#334155" }}>◉</span>
                  {s.label}
                </span>
                <span className="font-mono text-slate-600">{s.status}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-500">
            Requires ESP32-S3 firmware + EMG acquisition board
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
            Connect Hardware <span>→</span>
          </div>
        </button>

        {/* Manual / Demo Mode */}
        <button
          onClick={() => onSelect("manual")}
          className="group relative flex flex-col gap-4 p-7 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:border-emerald-500"
          style={{
            borderColor: "#1e293b",
            backgroundColor: "rgba(15,23,42,0.8)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(16,185,129,0.05), transparent 70%)",
            }}
          />

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="2"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <line
                  x1="8"
                  y1="10"
                  x2="16"
                  y2="10"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="13"
                  x2="14"
                  y2="13"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="16"
                  x2="12"
                  y2="16"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">
                Manual Entry
              </h3>
              <p className="text-xs text-emerald-500 font-mono">
                Demo / Clinical Data
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            Enter sensor readings manually or load pre-filled demo data. Ideal
            for testing the analysis pipeline without physical hardware
            connected.
          </p>

          <div className="space-y-1.5">
            {[
              { label: "IMU · Range of Motion + Gait", tabs: "12 fields" },
              { label: "Pressure · Load Distribution", tabs: "18 fields" },
              { label: "EMG · Muscle Activation", tabs: "8 fields" },
              { label: "Temperature · Thermal Data", tabs: "3 fields" },
              { label: "Camera · Biomechanics", tabs: "9 fields" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-500">{s.label}</span>
                <span className="font-mono text-slate-600">{s.tabs}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              Demo data available
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
            Enter Data Manually <span>→</span>
          </div>
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600 font-mono">
        PROTOTYPE SESSION ONLY · DATA IS NOT PERSISTED AFTER REFRESH
      </p>
    </div>
  )
}
