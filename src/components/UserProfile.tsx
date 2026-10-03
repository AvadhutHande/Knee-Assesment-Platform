import { useState } from "react"
import type { UserProfile as UserProfileType } from "../types"
import { demoProfile } from "../demoData"

interface Props {
  profile: UserProfileType
  onChange: (p: UserProfileType) => void
  onNext: () => void
}

const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"]
const ACTIVITY_LEVELS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
  "Athlete",
]
const HISTORY_OPTIONS = [
  "Previous knee sprain",
  "Ligament injury (ACL/MCL/LCL)",
  "Meniscus injury",
  "Knee surgery",
  "Osteoarthritis diagnosed",
  "Regular running > 20 km/week",
  "Contact sport history",
  "Previous physiotherapy for knee",
]

export default function UserProfile({ profile, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<K extends keyof UserProfileType>(
    key: K,
    val: UserProfileType[K],
  ) {
    onChange({ ...profile, [key]: val })
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }))
  }

  function toggleHistory(item: string) {
    const next = profile.history.includes(item)
      ? profile.history.filter((h) => h !== item)
      : [...profile.history, item]
    set("history", next)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!profile.name.trim()) e.name = "Name is required"
    if (!profile.ageRange) e.ageRange = "Select age range"
    if (!profile.height) e.height = "Height is required"
    if (!profile.weight) e.weight = "Weight is required"
    if (
      profile.height &&
      (Number(profile.height) < 100 || Number(profile.height) > 230)
    )
      e.height = "Enter a height from 100–230 cm"
    if (
      profile.weight &&
      (Number(profile.weight) < 30 || Number(profile.weight) > 300)
    )
      e.weight = "Enter a weight from 30–300 kg"
    if (!profile.activityLevel) e.activityLevel = "Select activity level"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            Step 1 of 7
          </p>
          <h2 className="text-2xl font-semibold text-white">Patient Profile</h2>
          <p className="text-slate-400 text-sm mt-1">
            Basic information for the assessment record
          </p>
        </div>
        <button
          onClick={() => onChange(demoProfile)}
          className="px-3 py-1.5 rounded text-xs font-mono border border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          Load Demo
        </button>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name / Patient ID
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Alex Morgan or PT-2024-001"
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition-colors"
            style={{ borderColor: errors.name ? "#ef4444" : "#1e293b" }}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Age + Height + Weight */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Age Range
            </label>
            <select
              value={profile.ageRange}
              onChange={(e) => set("ageRange", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              style={{ borderColor: errors.ageRange ? "#ef4444" : "#1e293b" }}
            >
              <option value="">Select</option>
              {AGE_RANGES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              value={profile.height}
              onChange={(e) => set("height", e.target.value)}
              placeholder="172"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition-colors"
              style={{ borderColor: errors.height ? "#ef4444" : "#1e293b" }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Weight (kg)
            </label>
            <input
              type="number"
              value={profile.weight}
              onChange={(e) => set("weight", e.target.value)}
              placeholder="74"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 transition-colors"
              style={{ borderColor: errors.weight ? "#ef4444" : "#1e293b" }}
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Activity Level
          </label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_LEVELS.map((a) => (
              <button
                key={a}
                onClick={() => set("activityLevel", a)}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                style={{
                  borderColor:
                    profile.activityLevel === a ? "#06b6d4" : "#1e293b",
                  color: profile.activityLevel === a ? "#06b6d4" : "#94a3b8",
                  backgroundColor:
                    profile.activityLevel === a
                      ? "rgba(6,182,212,0.08)"
                      : "transparent",
                }}
              >
                {a}
              </button>
            ))}
          </div>
          {errors.activityLevel && (
            <p className="text-red-400 text-xs mt-1">{errors.activityLevel}</p>
          )}
        </div>

        {/* Relevant History */}
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Relevant History{" "}
            <span className="normal-case text-slate-600">
              (select all that apply)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {HISTORY_OPTIONS.map((h) => {
              const selected = profile.history.includes(h)
              return (
                <button
                  key={h}
                  onClick={() => toggleHistory(h)}
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm transition-all cursor-pointer"
                  style={{
                    borderColor: selected ? "#06b6d4" : "#1e293b",
                    backgroundColor: selected
                      ? "rgba(6,182,212,0.06)"
                      : "rgba(15,23,42,0.5)",
                    color: selected ? "#e2e8f0" : "#94a3b8",
                  }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs"
                    style={{
                      borderColor: selected ? "#06b6d4" : "#334155",
                      background: selected ? "#06b6d4" : "transparent",
                      color: "#fff",
                    }}
                  >
                    {selected ? "✓" : ""}
                  </span>
                  {h}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => validate() && onNext()}
          className="px-8 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
