import { useState, useEffect } from "react"
import type { SensorData } from "../types"
import { demoSensorData } from "../demoData"

interface Props {
  onConnected: (data: SensorData) => void
}

type SensorState = "searching" | "found" | "connecting" | "connected" | "error"

interface Sensor {
  id: string
  name: string
  location: string
  battery: number
  signal: number
  state: SensorState
}

const INITIAL_SENSORS: Sensor[] = [
  {
    id: "imu_left_thigh",
    name: "Left Thigh IMU",
    location: "Left thigh · MPU-9250",
    battery: 87,
    signal: 94,
    state: "searching",
  },
  {
    id: "imu_left_shin",
    name: "Left Shin IMU",
    location: "Left shin · MPU-9250",
    battery: 84,
    signal: 92,
    state: "searching",
  },
  {
    id: "imu_right_thigh",
    name: "Right Thigh IMU",
    location: "Right thigh · MPU-9250",
    battery: 82,
    signal: 91,
    state: "searching",
  },
  {
    id: "imu_right_shin",
    name: "Right Shin IMU",
    location: "Right shin · MPU-9250",
    battery: 80,
    signal: 90,
    state: "searching",
  },
  {
    id: "pressure",
    name: "Pressure Insoles",
    location: "Bilateral · 8-sensor",
    battery: 74,
    signal: 88,
    state: "searching",
  },
  {
    id: "emg",
    name: "EMG Module",
    location: "Quad + Hamstring · ADS1299",
    battery: 91,
    signal: 96,
    state: "searching",
  },
  {
    id: "temp",
    name: "Temperature Sensors",
    location: "Bilateral · MLX90614",
    battery: 95,
    signal: 99,
    state: "searching",
  },
  {
    id: "camera",
    name: "Camera (Pose Est.)",
    location: "MediaPipe BlazePose",
    battery: 100,
    signal: 100,
    state: "searching",
  },
]

function SensorRow({ sensor }: { sensor: Sensor }) {
  const stateColors: Record<SensorState, string> = {
    searching: "#475569",
    found: "#f59e0b",
    connecting: "#06b6d4",
    connected: "#10b981",
    error: "#ef4444",
  }
  const stateLabels: Record<SensorState, string> = {
    searching: "Searching…",
    found: "Found",
    connecting: "Connecting…",
    connected: "Connected",
    error: "Error",
  }

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 transition-all"
      style={{
        borderColor:
          sensor.state === "connected" ? "rgba(16,185,129,0.3)" : "#1e293b",
      }}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            sensor.state === "searching" ? "blink-dot" : ""
          }`}
          style={{ backgroundColor: stateColors[sensor.state] }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{sensor.name}</span>
          <span
            className="text-xs font-mono"
            style={{ color: stateColors[sensor.state] }}
          >
            {stateLabels[sensor.state]}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {sensor.location}
        </p>
      </div>
      {sensor.state === "connected" && (
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Battery {sensor.battery}%</span>
          <div className="flex items-center gap-1">
            <span>Signal:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 rounded-sm"
                  style={{
                    height: `${4 + i * 2}px`,
                    backgroundColor:
                      i <= Math.ceil(sensor.signal / 20)
                        ? "#10b981"
                        : "#1e293b",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HardwareConnect({ onConnected }: Props) {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS)
  const [scanning, setScanning] = useState(false)
  const [liveData, setLiveData] = useState<{ imu: number[] emg: number[] }>({
    imu: [],
    emg: [],
  })

  const allConnected = sensors.every((s) => s.state === "connected")
  const connectedCount = sensors.filter((s) => s.state === "connected").length

  function startScan() {
    setScanning(true)
    setSensors(INITIAL_SENSORS)

    // Sequentially connect sensors with delays
    INITIAL_SENSORS.forEach((_, i) => {
      const delay = 700 + i * 500
      setTimeout(() => {
        setSensors((prev) =>
          prev.map((s, j) => (j === i ? { ...s, state: "found" } : s)),
        )
      }, delay - 250)
      setTimeout(() => {
        setSensors((prev) =>
          prev.map((s, j) => (j === i ? { ...s, state: "connecting" } : s)),
        )
      }, delay)
      setTimeout(() => {
        setSensors((prev) =>
          prev.map((s, j) => (j === i ? { ...s, state: "connected" } : s)),
        )
      }, delay + 400)
    })

    setTimeout(
      () => setScanning(false),
      700 + INITIAL_SENSORS.length * 500 + 500,
    )
  }

  // Simulate live data waveforms when connected
  useEffect(() => {
    if (!allConnected) return
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        imu: [
          ...prev.imu.slice(-30),
          30 + Math.sin(Date.now() / 300) * 15 + Math.random() * 8,
        ].slice(-30),
        emg: [
          ...prev.emg.slice(-30),
          20 + Math.abs(Math.sin(Date.now() / 150)) * 30 + Math.random() * 10,
        ].slice(-30),
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [allConnected])

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            Step 3 of 7 · Hardware Mode
          </p>
          <h2 className="text-2xl font-semibold text-white">Connect Sensors</h2>
          <p className="text-slate-400 text-sm mt-1">
            Scan for Bluetooth LE / USB devices
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-semibold text-cyan-400">
            {connectedCount}
            <span className="text-slate-600 text-lg">/{sensors.length}</span>
          </div>
          <p className="text-xs text-slate-500">connected</p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-300">
          Hardware simulation
        </p>
        <p className="mt-1 text-xs text-amber-100/60">
          No browser device connection is performed. The scan animation loads
          simulated demo measurements.
        </p>
      </div>

      {/* Scan progress bar */}
      {scanning && (
        <div className="mb-4 relative h-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-cyan-500 rounded-full"
            style={{ animation: "scan-h 1.5s ease-in-out infinite" }}
          />
        </div>
      )}

      <div className="space-y-2.5 mb-6">
        {sensors.map((s) => (
          <SensorRow key={s.id} sensor={s} />
        ))}
      </div>

      {/* Live preview when all connected */}
      {allConnected && liveData.imu.length > 5 && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-900/50 bg-slate-900/60">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
            Live Signal Preview
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "IMU · Gyro Y (thigh)",
                data: liveData.imu,
                color: "#06b6d4",
              },
              {
                label: "EMG · Quad Left",
                data: liveData.emg,
                color: "#10b981",
              },
            ].map(({ label, data, color }) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <svg
                  width="100%"
                  height="40"
                  viewBox="0 0 120 40"
                  preserveAspectRatio="none"
                >
                  {data.length > 1 && (
                    <polyline
                      points={data
                        .map(
                          (v, i) =>
                            `${(i / (data.length - 1)) * 120},${40 - v}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs font-mono text-slate-400">
            <span>IMU: 100 Hz ✓</span>
            <span>EMG: 1000 Hz ✓</span>
            <span>Temp: 10 Hz ✓</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!scanning && connectedCount < sensors.length && (
          <button
            onClick={startScan}
            className="flex-1 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}
          >
            {connectedCount === 0
              ? "⟳ Scan for Devices"
              : "⟳ Retry Failed Sensors"}
          </button>
        )}
        {scanning && (
          <div className="flex-1 py-3 rounded-lg text-sm font-semibold text-slate-400 text-center border border-slate-800">
            Scanning… {connectedCount}/{sensors.length} connected
          </div>
        )}
        {allConnected && (
          <button
            onClick={() => onConnected(demoSensorData)}
            className="flex-1 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 pulse-cyan"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
          >
            ✓ All Connected — Start Assessment →
          </button>
        )}
      </div>
    </div>
  )
}
