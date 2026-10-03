import { useState } from "react"
import type { SensorData } from "../types"
import { validateSensorData } from "../domain/assessment"

interface Props {
  data: SensorData
  onChange: (d: SensorData) => void
  onLoadDemo: () => void
  onNext: () => void
}

type Tab = "imu" | "pressure" | "emg" | "temperature" | "camera"

function Field({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  hint,
}: {
  label: string
  value: number
  unit?: string
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-600">{hint}</span>}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <div className="flex items-center gap-1 min-w-[70px] justify-end">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) =>
              onChange(Math.min(max, Math.max(min, Number(e.target.value))))
            }
            className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-300 text-right outline-none focus:border-cyan-600"
          />
          {unit && <span className="text-xs text-slate-500">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3
        className="text-xs font-mono uppercase tracking-widest mb-4"
        style={{ color }}
      >
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default function ManualEntry({
  data,
  onChange,
  onLoadDemo,
  onNext,
}: Props) {
  const [tab, setTab] = useState<Tab>("imu")
  const [errors, setErrors] = useState<string[]>([])

  function continueToQuestionnaire() {
    const nextErrors = validateSensorData(data)
    setErrors(nextErrors)
    if (nextErrors.length === 0) onNext()
  }

  function setImu<K extends keyof SensorData["imu"]>(k: K, v: number) {
    onChange({ ...data, imu: { ...data.imu, [k]: v } })
  }
  function setPressure<K extends keyof SensorData["pressure"]>(
    k: K,
    v: number,
  ) {
    onChange({ ...data, pressure: { ...data.pressure, [k]: v } })
  }
  function setEmg<K extends keyof SensorData["emg"]>(k: K, v: number) {
    onChange({ ...data, emg: { ...data.emg, [k]: v } })
  }
  function setTemp<K extends keyof SensorData["temperature"]>(k: K, v: number) {
    onChange({ ...data, temperature: { ...data.temperature, [k]: v } })
  }
  function setCamera<K extends keyof SensorData["camera"]>(k: K, v: number) {
    onChange({ ...data, camera: { ...data.camera, [k]: v } })
  }

  const tabs: Array<{ id: Tab label: string color: string icon: string }> = [
    { id: "imu", label: "IMU · Motion", color: "#06b6d4", icon: "⬡" },
    { id: "pressure", label: "Pressure", color: "#8b5cf6", icon: "▦" },
    { id: "emg", label: "EMG · Muscle", color: "#f59e0b", icon: "∿" },
    { id: "temperature", label: "Temperature", color: "#f97316", icon: "◈" },
    { id: "camera", label: "Camera", color: "#10b981", icon: "⊡" },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            Step 3 of 7 · Manual Entry
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Enter Sensor Data
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Input processed measurements from each sensor modality
          </p>
        </div>
        <button
          onClick={() => {
            onLoadDemo()
            setErrors([])
          }}
          className="px-3 py-1.5 rounded text-xs font-mono border border-slate-700 text-slate-400 hover:border-emerald-700 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          Load Demo
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: tab === t.id ? t.color : "#1e293b",
              backgroundColor: tab === t.id ? `${t.color}18` : "transparent",
              color: tab === t.id ? t.color : "#64748b",
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === "imu" && (
          <>
            <SectionCard title="Range of Motion (Processed)" color="#06b6d4">
              <Field
                label="ROM Left Knee"
                value={data.imu.rom_left}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setImu("rom_left", v)}
                hint="Goniometer or computed"
              />
              <Field
                label="ROM Right Knee"
                value={data.imu.rom_right}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setImu("rom_right", v)}
              />
              <Field
                label="Max Flexion Left"
                value={data.imu.max_flexion_left}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setImu("max_flexion_left", v)}
              />
              <Field
                label="Max Flexion Right"
                value={data.imu.max_flexion_right}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setImu("max_flexion_right", v)}
              />
            </SectionCard>
            <SectionCard title="Extension Deficit" color="#06b6d4">
              <Field
                label="Extension Deficit Left"
                value={data.imu.extension_deficit_left}
                unit="°"
                min={0}
                max={30}
                onChange={(v) => setImu("extension_deficit_left", v)}
                hint="0 = full extension"
              />
              <Field
                label="Extension Deficit Right"
                value={data.imu.extension_deficit_right}
                unit="°"
                min={0}
                max={30}
                onChange={(v) => setImu("extension_deficit_right", v)}
              />
            </SectionCard>
            <SectionCard title="Gait & Movement Quality" color="#06b6d4">
              <Field
                label="Angular Velocity Peak"
                value={data.imu.angular_velocity_peak}
                unit="°/s"
                min={50}
                max={400}
                onChange={(v) => setImu("angular_velocity_peak", v)}
              />
              <Field
                label="Movement Smoothness"
                value={Math.round(data.imu.movement_smoothness * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setImu("movement_smoothness", v / 100)}
                hint="0=jerky, 100=smooth"
              />
              <Field
                label="Gait Cycle Time"
                value={data.imu.gait_cycle_time * 100}
                unit="×10ms"
                min={60}
                max={200}
                onChange={(v) => setImu("gait_cycle_time", v / 100)}
              />
              <Field
                label="Stride Symmetry"
                value={Math.round(data.imu.stride_symmetry * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setImu("stride_symmetry", v / 100)}
              />
            </SectionCard>
            <SectionCard title="Raw IMU Sample (Single Frame)" color="#334155">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-2">Thigh IMU</p>
                  <Field
                    label="Acc X"
                    value={data.imu.raw_thigh_acc_x * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_thigh_acc_x", v / 100)}
                  />
                  <Field
                    label="Acc Y"
                    value={data.imu.raw_thigh_acc_y * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_thigh_acc_y", v / 100)}
                  />
                  <Field
                    label="Acc Z"
                    value={data.imu.raw_thigh_acc_z * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_thigh_acc_z", v / 100)}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Shin IMU</p>
                  <Field
                    label="Acc X"
                    value={data.imu.raw_shin_acc_x * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_shin_acc_x", v / 100)}
                  />
                  <Field
                    label="Acc Y"
                    value={data.imu.raw_shin_acc_y * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_shin_acc_y", v / 100)}
                  />
                  <Field
                    label="Acc Z"
                    value={data.imu.raw_shin_acc_z * 100}
                    unit="×0.01g"
                    min={-1000}
                    max={1000}
                    onChange={(v) => setImu("raw_shin_acc_z", v / 100)}
                  />
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {tab === "pressure" && (
          <>
            <SectionCard title="Load Distribution" color="#8b5cf6">
              <Field
                label="Left Leg Load %"
                value={data.pressure.left_load_pct}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => {
                  setPressure("left_load_pct", v)
                  setPressure("right_load_pct", 100 - v)
                }}
                hint="Right auto-balances"
              />
              <div className="flex gap-4 items-center py-1">
                <div className="flex-1 h-6 rounded-l overflow-hidden bg-slate-800">
                  <div
                    className="h-full rounded-l"
                    style={{
                      width: `${data.pressure.left_load_pct}%`,
                      background: "linear-gradient(90deg, #7c3aed, #8b5cf6)",
                    }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {data.pressure.left_load_pct}% /{" "}
                  {data.pressure.right_load_pct}%
                </span>
                <div className="flex-1 h-6 rounded-r overflow-hidden bg-slate-800">
                  <div
                    className="h-full rounded-r"
                    style={{
                      width: `${data.pressure.right_load_pct}%`,
                      background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                      marginLeft: "auto",
                    }}
                  />
                </div>
              </div>
              <Field
                label="Stance Time Left"
                value={data.pressure.stance_time_left}
                unit="ms"
                min={300}
                max={1200}
                onChange={(v) => setPressure("stance_time_left", v)}
              />
              <Field
                label="Stance Time Right"
                value={data.pressure.stance_time_right}
                unit="ms"
                min={300}
                max={1200}
                onChange={(v) => setPressure("stance_time_right", v)}
              />
              <Field
                label="Heel/Toe Ratio Left"
                value={Math.round(data.pressure.heel_ratio_left * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setPressure("heel_ratio_left", v / 100)}
                hint="% heel loading"
              />
              <Field
                label="Heel/Toe Ratio Right"
                value={Math.round(data.pressure.heel_ratio_right * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setPressure("heel_ratio_right", v / 100)}
              />
            </SectionCard>
            <SectionCard
              title="Left Insole — 8-Point Grid (kPa)"
              color="#8b5cf6"
            >
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((i) => {
                  const key = `left_p${i}` as keyof typeof data.pressure
                  const v = data.pressure[key] as number
                  return (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-500 mb-1">P{i}</div>
                      <div className="h-16 rounded-lg flex items-end overflow-hidden bg-slate-800">
                        <div
                          className="w-full rounded-lg transition-all"
                          style={{
                            height: `${Math.min(100, (v / 800) * 100)}%`,
                            background:
                              "linear-gradient(0deg, #7c3aed, #a78bfa)",
                          }}
                        />
                      </div>
                      <input
                        type="number"
                        value={v}
                        min={0}
                        max={800}
                        onChange={(e) =>
                          setPressure(key, Number(e.target.value))
                        }
                        className="mt-1 w-full text-center text-xs font-mono bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-purple-300 outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            </SectionCard>
            <SectionCard
              title="Right Insole — 8-Point Grid (kPa)"
              color="#8b5cf6"
            >
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((i) => {
                  const key = `right_p${i}` as keyof typeof data.pressure
                  const v = data.pressure[key] as number
                  return (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-500 mb-1">P{i}</div>
                      <div className="h-16 rounded-lg flex items-end overflow-hidden bg-slate-800">
                        <div
                          className="w-full rounded-lg transition-all"
                          style={{
                            height: `${Math.min(100, (v / 800) * 100)}%`,
                            background:
                              "linear-gradient(0deg, #7c3aed, #a78bfa)",
                          }}
                        />
                      </div>
                      <input
                        type="number"
                        value={v}
                        min={0}
                        max={800}
                        onChange={(e) =>
                          setPressure(key, Number(e.target.value))
                        }
                        className="mt-1 w-full text-center text-xs font-mono bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-purple-300 outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          </>
        )}

        {tab === "emg" && (
          <>
            <SectionCard
              title="Quadriceps Activation (normalized RMS)"
              color="#f59e0b"
            >
              <Field
                label="Quad Left"
                value={Math.round(data.emg.quad_left * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("quad_left", v / 100)}
                hint="100% = max voluntary"
              />
              <Field
                label="Quad Right"
                value={Math.round(data.emg.quad_right * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("quad_right", v / 100)}
              />
              <div className="flex gap-3 py-2">
                {[
                  { label: "Left", v: data.emg.quad_left, color: "#f59e0b" },
                  { label: "Right", v: data.emg.quad_right, color: "#fbbf24" },
                ].map(({ label, v, color }) => (
                  <div key={label} className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{label}</span>
                      <span className="font-mono">{Math.round(v * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${v * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard
              title="Hamstring Activation (normalized RMS)"
              color="#f59e0b"
            >
              <Field
                label="Hamstring Left"
                value={Math.round(data.emg.hamstring_left * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("hamstring_left", v / 100)}
              />
              <Field
                label="Hamstring Right"
                value={Math.round(data.emg.hamstring_right * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("hamstring_right", v / 100)}
              />
            </SectionCard>
            <SectionCard
              title="Gastrocnemius & Derived Metrics"
              color="#f59e0b"
            >
              <Field
                label="Gastrocnemius Left"
                value={Math.round(data.emg.gastrocnemius_left * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("gastrocnemius_left", v / 100)}
              />
              <Field
                label="Gastrocnemius Right"
                value={Math.round(data.emg.gastrocnemius_right * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("gastrocnemius_right", v / 100)}
              />
              <Field
                label="Co-contraction Ratio"
                value={Math.round(data.emg.cocontraction_ratio * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("cocontraction_ratio", v / 100)}
                hint="Quad/Ham simultaneous"
              />
              <Field
                label="Fatigue Index"
                value={Math.round(data.emg.fatigue_index * 100)}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setEmg("fatigue_index", v / 100)}
                hint="0=no fatigue, 100=high"
              />
            </SectionCard>
          </>
        )}

        {tab === "temperature" && (
          <>
            <SectionCard title="Knee Surface Temperature" color="#f97316">
              <Field
                label="Left Knee"
                value={data.temperature.left_knee * 10}
                unit="×0.1°C"
                min={290}
                max={410}
                onChange={(v) => setTemp("left_knee", v / 10)}
                hint="Normal ≈ 32–34°C"
              />
              <Field
                label="Right Knee"
                value={data.temperature.right_knee * 10}
                unit="×0.1°C"
                min={290}
                max={410}
                onChange={(v) => setTemp("right_knee", v / 10)}
              />
              <Field
                label="Ambient Temperature"
                value={data.temperature.ambient * 10}
                unit="×0.1°C"
                min={150}
                max={350}
                onChange={(v) => setTemp("ambient", v / 10)}
              />
            </SectionCard>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
                Thermal Readout
              </p>
              <div className="flex items-end gap-6 justify-center py-4">
                {[
                  {
                    label: "Left Knee",
                    value: data.temperature.left_knee,
                    color: "#f97316",
                  },
                  {
                    label: "Ambient",
                    value: data.temperature.ambient,
                    color: "#475569",
                  },
                  {
                    label: "Right Knee",
                    value: data.temperature.right_knee,
                    color: "#ef4444",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div
                      className="text-2xl font-mono font-semibold"
                      style={{ color }}
                    >
                      {value.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span
                  className="text-sm font-mono"
                  style={{
                    color:
                      Math.abs(
                        data.temperature.left_knee -
                          data.temperature.right_knee,
                      ) > 1
                        ? "#f97316"
                        : "#10b981",
                  }}
                >
                  Δ ={" "}
                  {Math.abs(
                    data.temperature.left_knee - data.temperature.right_knee,
                  ).toFixed(1)}
                  °C
                  {Math.abs(
                    data.temperature.left_knee - data.temperature.right_knee,
                  ) > 1
                    ? " ⚠ Asymmetry detected"
                    : " ✓ Within normal range"}
                </span>
              </div>
            </div>
          </>
        )}

        {tab === "camera" && (
          <>
            <SectionCard title="Joint Angles (Pose Estimation)" color="#10b981">
              <Field
                label="Knee Angle Left"
                value={data.camera.knee_angle_left}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setCamera("knee_angle_left", v)}
                hint="During squat/assessment"
              />
              <Field
                label="Knee Angle Right"
                value={data.camera.knee_angle_right}
                unit="°"
                min={0}
                max={160}
                onChange={(v) => setCamera("knee_angle_right", v)}
              />
              <Field
                label="Hip Angle"
                value={data.camera.hip_angle}
                unit="°"
                min={60}
                max={180}
                onChange={(v) => setCamera("hip_angle", v)}
              />
              <Field
                label="Ankle Dorsiflexion"
                value={data.camera.ankle_dorsiflexion}
                unit="°"
                min={0}
                max={40}
                onChange={(v) => setCamera("ankle_dorsiflexion", v)}
              />
            </SectionCard>
            <SectionCard title="Valgus / Varus + Quality" color="#10b981">
              <Field
                label="Valgus Left"
                value={data.camera.valgus_left}
                unit="°"
                min={0}
                max={25}
                onChange={(v) => setCamera("valgus_left", v)}
                hint="0=neutral, >10=concern"
              />
              <Field
                label="Valgus Right"
                value={data.camera.valgus_right}
                unit="°"
                min={0}
                max={25}
                onChange={(v) => setCamera("valgus_right", v)}
              />
              <Field
                label="Symmetry Score"
                value={data.camera.symmetry_score}
                unit="%"
                min={0}
                max={100}
                onChange={(v) => setCamera("symmetry_score", v)}
                hint="100=perfect bilateral"
              />
              <Field
                label="Squat Depth"
                value={data.camera.squat_depth_cm}
                unit="cm"
                min={0}
                max={70}
                onChange={(v) => setCamera("squat_depth_cm", v)}
              />
              <Field
                label="Trunk Lean"
                value={data.camera.trunk_lean}
                unit="°"
                min={0}
                max={45}
                onChange={(v) => setCamera("trunk_lean", v)}
                hint="Forward trunk inclination"
              />
            </SectionCard>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                IMU vs Camera Agreement
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    IMU Knee Angle (avg)
                  </p>
                  <p className="font-mono text-cyan-300 text-xl">
                    {Math.round((data.imu.rom_left + data.imu.rom_right) / 2)}°
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Camera Estimate (avg)
                  </p>
                  <p className="font-mono text-emerald-300 text-xl">
                    {Math.round(
                      (data.camera.knee_angle_left +
                        data.camera.knee_angle_right) /
                        2,
                    )}
                    °
                  </p>
                </div>
              </div>
              <div
                className="mt-3 text-xs font-mono"
                style={{
                  color:
                    Math.abs(
                      (data.imu.rom_left + data.imu.rom_right) / 2 -
                        (data.camera.knee_angle_left +
                          data.camera.knee_angle_right) /
                          2,
                    ) < 10
                      ? "#10b981"
                      : "#f59e0b",
                }}
              >
                Δ ={" "}
                {Math.abs(
                  (data.imu.rom_left + data.imu.rom_right) / 2 -
                    (data.camera.knee_angle_left +
                      data.camera.knee_angle_right) /
                      2,
                ).toFixed(1)}
                ° —
                {Math.abs(
                  (data.imu.rom_left + data.imu.rom_right) / 2 -
                    (data.camera.knee_angle_left +
                      data.camera.knee_angle_right) /
                      2,
                ) < 10
                  ? " Agreement GOOD"
                  : " Agreement POOR — recheck sensor placement"}
              </div>
            </div>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-900/50 bg-red-950/20 p-4"
        >
          <p className="text-xs font-semibold text-red-300">
            Resolve these data integrity issues:
          </p>
          <ul className="mt-2 space-y-1">
            {errors.map((error) => (
              <li key={error} className="text-xs text-red-200/70">
                · {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={continueToQuestionnaire}
          className="px-8 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}
        >
          Continue to Questionnaire →
        </button>
      </div>
    </div>
  )
}
