import { useState } from "react"
import type {
  AnalysisResults,
  DataSource,
  SensorData,
  Questionnaire,
  UserProfile,
} from "../types"

interface Props {
  results: AnalysisResults
  sensor: SensorData
  questionnaire: Questionnaire
  profile: UserProfile
  dataSource: DataSource
  onRestart: () => void
}

type ResultTab = "overview" | "analysis" | "pattern" | "recommendations"

function Gauge({
  value,
  max = 100,
  label,
  color,
  unit = "",
}: {
  value: number
  max?: number
  label: string
  color: string
  unit?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  const r = 32
  const circumference = 2 * Math.PI * r
  const dash = circumference * (pct / 100)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="#1e293b"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text
          x="40"
          y="43"
          textAnchor="middle"
          fontSize="14"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          {Math.round(value)}
          {unit}
        </text>
      </svg>
      <span className="text-xs text-slate-500 text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

function MetricRow({
  label,
  leftVal,
  rightVal,
  unit = "",
  leftColor,
  rightColor,
  diff,
  diffThreshold,
}: {
  label: string
  leftVal: number
  rightVal: number
  unit?: string
  leftColor?: string
  rightColor?: string
  diff?: number
  diffThreshold?: number
}) {
  const asymmetry = diff ?? Math.abs(leftVal - rightVal)
  const flagged = diffThreshold !== undefined && asymmetry > diffThreshold

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <div className="text-right">
        <span
          className="font-mono text-sm"
          style={{ color: leftColor ?? "#94a3b8" }}
        >
          {leftVal.toFixed(1)}
          {unit}
        </span>
        <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
          <div
            className="h-1.5 rounded-full ml-auto"
            style={{
              width: `${Math.min(100, (leftVal / Math.max(leftVal, rightVal)) * 100)}%`,
              backgroundColor: leftColor ?? "#06b6d4",
            }}
          />
        </div>
      </div>
      <span className="text-xs text-slate-600 w-2">L</span>
      <div className="text-center w-24 text-xs text-slate-400">
        {label}
        <br />
        {flagged && (
          <span className="text-amber-400 text-[10px]">⚠ Asymmetry</span>
        )}
      </div>
      <span className="text-xs text-slate-600 w-2">R</span>
      <div>
        <span
          className="font-mono text-sm"
          style={{ color: rightColor ?? "#94a3b8" }}
        >
          {rightVal.toFixed(1)}
          {unit}
        </span>
        <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.min(100, (rightVal / Math.max(leftVal, rightVal)) * 100)}%`,
              backgroundColor: rightColor ?? "#8b5cf6",
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ScoreBar({
  label,
  value,
  max = 100,
  color,
  description,
}: {
  label: string
  value: number
  max?: number
  color: string
  description: string
}) {
  const pct = (value / max) * 100
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono" style={{ color }}>
          {value.toFixed(0)}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-slate-600 mt-1">{description}</p>
    </div>
  )
}

export default function Results({
  results,
  sensor,
  questionnaire,
  profile,
  dataSource,
  onRestart,
}: Props) {
  const [tab, setTab] = useState<ResultTab>("overview")

  const tabs: Array<{ id: ResultTab label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "analysis", label: "Analysis" },
    { id: "pattern", label: "Pattern" },
    { id: "recommendations", label: "Guidance" },
  ]

  const tempDiff = Math.abs(
    sensor.temperature.left_knee - sensor.temperature.right_knee,
  )
  const tempColor =
    tempDiff > 1.5 ? "#ef4444" : tempDiff > 0.8 ? "#f59e0b" : "#10b981"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            Assessment Complete
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Knee Functional Profile
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {profile.name} ·{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-lg text-xs font-mono border border-slate-700 text-slate-400 hover:border-slate-500 transition-colors cursor-pointer"
        >
          New Session
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3">
        <span className="rounded px-2 py-1 text-xs font-mono text-amber-300 border border-amber-800/50">
          {results.algorithm_version}
        </span>
        <span className="text-xs text-amber-200/70">
          {dataSource === "demo"
            ? "Demo data"
            : dataSource === "simulated-hardware"
              ? "Simulated hardware data"
              : "Manually entered data"}{" "}
          · Unvalidated rules, not model probability
        </span>
      </div>

      {/* Red flag banner */}
      {results.red_flags.length > 0 && (
        <div className="mb-5 p-4 rounded-xl border border-red-900/60 bg-red-950/30 flex items-start gap-3">
          <span className="text-red-400 text-lg">⚠</span>
          <div>
            <p className="text-sm font-semibold text-red-400">
              {results.safety_severity.toUpperCase()} safety finding — follow
              the action below
            </p>
            <ul className="mt-1 space-y-0.5">
              {results.safety_flags.map((flag) => (
                <li key={flag.id} className="text-xs text-red-300/80">
                  · {flag.title}: {flag.action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer"
            style={{
              borderColor: tab === t.id ? "#06b6d4" : "transparent",
              color: tab === t.id ? "#06b6d4" : "#64748b",
              marginBottom: "-1px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* Knee profile scores */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-5">
              Knee Functional Profile
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
              <Gauge
                value={results.movement_score}
                label="Movement"
                color="#06b6d4"
              />
              <Gauge
                value={results.loading_score}
                label="Loading"
                color="#8b5cf6"
              />
              <Gauge
                value={results.muscle_score}
                label="Muscle"
                color="#f59e0b"
              />
              <Gauge
                value={100 - Math.round(tempDiff * 20)}
                label="Thermal"
                color="#f97316"
              />
              <Gauge
                value={sensor.camera.symmetry_score}
                label="Symmetry"
                color="#10b981"
              />
              <Gauge
                value={100 - questionnaire.pain_score * 10}
                label="Pain Index"
                color={questionnaire.pain_score > 6 ? "#ef4444" : "#64748b"}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "ROM Asymmetry",
                value: `${results.rom_asymmetry.toFixed(0)}°`,
                color:
                  results.rom_asymmetry > 15
                    ? "#ef4444"
                    : results.rom_asymmetry > 8
                      ? "#f59e0b"
                      : "#10b981",
                sub: `L ${sensor.imu.rom_left}° / R ${sensor.imu.rom_right}°`,
              },
              {
                label: "Load Asymmetry",
                value: `${results.loading_asymmetry.toFixed(0)}%`,
                color: results.loading_asymmetry > 10 ? "#f59e0b" : "#10b981",
                sub: `L ${sensor.pressure.left_load_pct}% / R ${sensor.pressure.right_load_pct}%`,
              },
              {
                label: "Quad Asymmetry",
                value: `${results.quad_asymmetry.toFixed(0)}%`,
                color: results.quad_asymmetry > 20 ? "#f59e0b" : "#10b981",
                sub: `L ${Math.round(sensor.emg.quad_left * 100)}% / R ${Math.round(sensor.emg.quad_right * 100)}%`,
              },
              {
                label: "Temp Difference",
                value: `${tempDiff.toFixed(1)}°C`,
                color: tempColor,
                sub: `L ${sensor.temperature.left_knee}°C / R ${sensor.temperature.right_knee}°C`,
              },
            ].map(({ label, value, color, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <p className="text-xs text-slate-500 mb-2">{label}</p>
                <p className="text-2xl font-mono font-bold" style={{ color }}>
                  {value}
                </p>
                <p className="text-xs font-mono text-slate-600 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Summary text */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
              Clinical Summary
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Assessment identifies{" "}
              <strong className="text-white">
                {results.rom_asymmetry > 15 ? "significant" : "moderate"}{" "}
                right-sided ROM reduction
              </strong>{" "}
              ({sensor.imu.rom_left}° L vs {sensor.imu.rom_right}° R), with{" "}
              <strong className="text-white">
                {results.loading_asymmetry > 8 ? "notable" : "mild"} load
                asymmetry
              </strong>{" "}
              ({sensor.pressure.left_load_pct}%/{sensor.pressure.right_load_pct}
              % L/R), and{" "}
              <strong className="text-white">
                quadriceps activation asymmetry
              </strong>{" "}
              ({Math.round(sensor.emg.quad_left * 100)}% L vs{" "}
              {Math.round(sensor.emg.quad_right * 100)}% R). Patient-reported
              pain of {questionnaire.pain_score}/10 localised to the{" "}
              {questionnaire.pain_locations.join(", ")}.
            </p>
            <p className="text-xs text-slate-600 mt-3 font-mono">
              ⓘ This is not a clinical diagnosis. Results should be interpreted
              by a qualified clinician.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {tab === "analysis" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#06b6d4" }}
            >
              Movement Analysis · IMU + Camera
            </p>
            <MetricRow
              label="ROM"
              leftVal={sensor.imu.rom_left}
              rightVal={sensor.imu.rom_right}
              unit="°"
              leftColor="#06b6d4"
              rightColor="#8b5cf6"
              diffThreshold={10}
            />
            <MetricRow
              label="Max Flexion"
              leftVal={sensor.imu.max_flexion_left}
              rightVal={sensor.imu.max_flexion_right}
              unit="°"
              leftColor="#06b6d4"
              rightColor="#8b5cf6"
              diffThreshold={10}
            />
            <MetricRow
              label="Ext. Deficit"
              leftVal={sensor.imu.extension_deficit_left}
              rightVal={sensor.imu.extension_deficit_right}
              unit="°"
              leftColor="#10b981"
              rightColor="#f59e0b"
              diffThreshold={5}
            />
            <MetricRow
              label="Valgus"
              leftVal={sensor.camera.valgus_left}
              rightVal={sensor.camera.valgus_right}
              unit="°"
              leftColor="#10b981"
              rightColor="#f59e0b"
              diffThreshold={6}
            />
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Smoothness</span>
                <br />
                <span className="font-mono text-cyan-300">
                  {(sensor.imu.movement_smoothness * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-slate-500">Gait Cycle</span>
                <br />
                <span className="font-mono text-cyan-300">
                  {sensor.imu.gait_cycle_time.toFixed(2)}s
                </span>
              </div>
              <div>
                <span className="text-slate-500">Stride Symmetry</span>
                <br />
                <span className="font-mono text-cyan-300">
                  {(sensor.imu.stride_symmetry * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#8b5cf6" }}
            >
              Loading Analysis · Pressure Insoles
            </p>
            <MetricRow
              label="Load %"
              leftVal={sensor.pressure.left_load_pct}
              rightVal={sensor.pressure.right_load_pct}
              unit="%"
              leftColor="#8b5cf6"
              rightColor="#a78bfa"
              diffThreshold={8}
            />
            <MetricRow
              label="Stance Time"
              leftVal={sensor.pressure.stance_time_left}
              rightVal={sensor.pressure.stance_time_right}
              unit="ms"
              leftColor="#8b5cf6"
              rightColor="#a78bfa"
              diffThreshold={60}
            />
            <MetricRow
              label="Heel Ratio"
              leftVal={sensor.pressure.heel_ratio_left * 100}
              rightVal={sensor.pressure.heel_ratio_right * 100}
              unit="%"
              leftColor="#8b5cf6"
              rightColor="#a78bfa"
              diffThreshold={15}
            />
            {/* Foot heatmaps */}
            <div className="mt-4 grid grid-cols-2 gap-6">
              {["left", "right"].map((side) => {
                const ps =
                  side === "left"
                    ? [
                        sensor.pressure.left_p1,
                        sensor.pressure.left_p2,
                        sensor.pressure.left_p3,
                        sensor.pressure.left_p4,
                        sensor.pressure.left_p5,
                        sensor.pressure.left_p6,
                        sensor.pressure.left_p7,
                        sensor.pressure.left_p8,
                      ]
                    : [
                        sensor.pressure.right_p1,
                        sensor.pressure.right_p2,
                        sensor.pressure.right_p3,
                        sensor.pressure.right_p4,
                        sensor.pressure.right_p5,
                        sensor.pressure.right_p6,
                        sensor.pressure.right_p7,
                        sensor.pressure.right_p8,
                      ]
                const maxP = Math.max(...ps)
                return (
                  <div key={side}>
                    <p className="text-xs text-slate-500 text-center mb-2 capitalize">
                      {side} Foot (8-sensor)
                    </p>
                    <div className="grid grid-cols-2 gap-1 max-w-[120px] mx-auto">
                      {ps.map((p, i) => (
                        <div
                          key={i}
                          className="h-10 rounded flex items-center justify-center text-xs font-mono"
                          style={{
                            backgroundColor: `rgba(139,92,246,${0.1 + (p / maxP) * 0.8})`,
                            color: p / maxP > 0.5 ? "#e2e8f0" : "#64748b",
                          }}
                        >
                          {Math.round(p)}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#f59e0b" }}
            >
              Muscle Analysis · EMG
            </p>
            <MetricRow
              label="Quadriceps"
              leftVal={sensor.emg.quad_left * 100}
              rightVal={sensor.emg.quad_right * 100}
              unit="%"
              leftColor="#f59e0b"
              rightColor="#fbbf24"
              diffThreshold={20}
            />
            <MetricRow
              label="Hamstring"
              leftVal={sensor.emg.hamstring_left * 100}
              rightVal={sensor.emg.hamstring_right * 100}
              unit="%"
              leftColor="#f59e0b"
              rightColor="#fbbf24"
              diffThreshold={20}
            />
            <MetricRow
              label="Gastrocnemius"
              leftVal={sensor.emg.gastrocnemius_left * 100}
              rightVal={sensor.emg.gastrocnemius_right * 100}
              unit="%"
              leftColor="#f59e0b"
              rightColor="#fbbf24"
              diffThreshold={20}
            />
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Co-contraction</span>
                <br />
                <span className="font-mono text-amber-300">
                  {(sensor.emg.cocontraction_ratio * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-slate-500">Fatigue Index</span>
                <br />
                <span
                  className="font-mono"
                  style={{
                    color:
                      sensor.emg.fatigue_index > 0.4 ? "#ef4444" : "#10b981",
                  }}
                >
                  {(sensor.emg.fatigue_index * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "#f97316" }}
            >
              Thermal Analysis
            </p>
            <div className="flex items-center justify-around py-3">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-orange-400">
                  {sensor.temperature.left_knee.toFixed(1)}°C
                </div>
                <p className="text-xs text-slate-500 mt-1">Left Knee</p>
              </div>
              <div className="text-center">
                <div
                  className="text-sm font-mono font-bold"
                  style={{ color: tempColor }}
                >
                  Δ {tempDiff.toFixed(1)}°C
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {tempDiff > 1.5
                    ? "⚠ Significant"
                    : tempDiff > 0.8
                      ? "⚠ Mild asym."
                      : "✓ Normal"}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-red-400">
                  {sensor.temperature.right_knee.toFixed(1)}°C
                </div>
                <p className="text-xs text-slate-500 mt-1">Right Knee</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Tab */}
      {tab === "pattern" && (
        <div className="space-y-4">
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: "rgba(6,182,212,0.3)",
              background: "rgba(6,182,212,0.04)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(6,182,212,0.1)" }}
              >
                ⬡
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    Primary Pattern
                  </p>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      background:
                        results.pattern_confidence === "High"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(245,158,11,0.15)",
                      color:
                        results.pattern_confidence === "High"
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  >
                    {results.pattern_confidence} rule match
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {results.pattern}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {results.pattern_description}
                </p>
                <p className="text-xs font-mono text-cyan-300/70 mt-3">
                  {results.match_summary}
                </p>
              </div>
            </div>
          </div>

          {/* Supporting evidence */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
              Supporting Evidence
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "ROM reduction right knee",
                  val: `${sensor.imu.rom_right}° (vs ${sensor.imu.rom_left}° left)`,
                  flagged: results.rom_asymmetry > 10,
                },
                {
                  label: "Right-sided loading asymmetry",
                  val: `${sensor.pressure.right_load_pct}% right / ${sensor.pressure.left_load_pct}% left`,
                  flagged: results.loading_asymmetry > 8,
                },
                {
                  label: "Quadriceps activation asymmetry",
                  val: `${Math.round(sensor.emg.quad_left * 100)}% L / ${Math.round(sensor.emg.quad_right * 100)}% R`,
                  flagged: results.quad_asymmetry > 15,
                },
                {
                  label: "Knee valgus right (camera)",
                  val: `${sensor.camera.valgus_right}° (L ${sensor.camera.valgus_left}°)`,
                  flagged: sensor.camera.valgus_right > 8,
                },
                {
                  label: "Anterior pain on stairs/squat",
                  val:
                    questionnaire.aggravating_activities
                      .filter((a) =>
                        ["Stairs (up)", "Stairs (down)", "Squatting"].includes(
                          a,
                        ),
                      )
                      .join(", ") || "Not reported",
                  flagged: questionnaire.aggravating_activities.some(
                    (a) => a.includes("Stairs") || a.includes("Squat"),
                  ),
                },
                {
                  label: "Temperature asymmetry",
                  val: `Δ ${tempDiff.toFixed(1)}°C`,
                  flagged: tempDiff > 0.8,
                },
              ].map(({ label, val, flagged }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0"
                >
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: flagged ? "#f59e0b" : "#10b981" }}
                  >
                    {flagged ? "◆" : "✓"}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-xs font-mono text-white mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary patterns */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
              Configured Indicator Matches
            </p>
            <div className="space-y-3">
              {results.secondary_patterns.map(({ name, probability }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{name}</span>
                    <span className="font-mono text-slate-500">
                      {probability}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-slate-600"
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-600 italic">
              Percentages show the proportion of configured prototype indicators
              matched, not diagnostic probability. Definitive diagnosis requires
              clinical assessment, imaging when indicated, and specialist
              review.
            </p>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {tab === "recommendations" && (
        <div className="space-y-4">
          {/* Safety check */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor:
                results.red_flags.length > 0
                  ? "rgba(239,68,68,0.4)"
                  : "rgba(16,185,129,0.3)",
              background:
                results.red_flags.length > 0
                  ? "rgba(239,68,68,0.05)"
                  : "rgba(16,185,129,0.04)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">
                {results.red_flags.length > 0 ? "⚠" : "✓"}
              </span>
              <p className="font-semibold text-white">
                {results.red_flags.length > 0
                  ? "Red Flags Detected"
                  : "No Urgent Red Flags Detected"}
              </p>
            </div>
            {results.red_flags.length > 0 ? (
              results.red_flags.map((f) => (
                <p key={f} className="text-xs text-red-300 ml-7">
                  · {f}
                </p>
              ))
            ) : (
              <p className="text-xs text-slate-400 ml-7">
                No configured urgent indicator was reported. This does not rule
                out serious illness or injury.
              </p>
            )}
          </div>

          {/* Recommended pathway */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
              Recommended Next Steps
            </p>
            <div className="space-y-3">
              {results.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/40"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(6,182,212,0.15)",
                      color: "#06b6d4",
                      border: "1px solid rgba(6,182,212,0.3)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring plan */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
              Monitoring Plan
            </p>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              {[
                {
                  period: "2 Weeks",
                  action: "Repeat assessment if symptoms change",
                  color: "#06b6d4",
                },
                {
                  period: "4 Weeks",
                  action: "Progress review with follow-up assessment",
                  color: "#8b5cf6",
                },
                {
                  period: "8 Weeks",
                  action: "Full reassessment and trend analysis",
                  color: "#10b981",
                },
              ].map(({ period, action, color }) => (
                <div
                  key={period}
                  className="p-3 rounded-lg border border-slate-700/50"
                >
                  <div
                    className="font-mono font-semibold mb-2"
                    style={{ color }}
                  >
                    {period}
                  </div>
                  <p className="text-slate-500">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Clinical Disclaimer: </strong>
            This assessment generates a functional profile based on measured
            biomechanical and physiological signals combined with
            patient-reported symptoms. It does not constitute a clinical
            diagnosis. All findings should be interpreted by a qualified
            clinician. Seek immediate medical attention if you experience sudden
            severe pain, significant swelling, inability to weight-bear, or
            fever with hot/swollen joint.
          </div>
        </div>
      )}
    </div>
  )
}
