import { useState } from "react"
import type { Questionnaire as QuestionnaireType } from "../types"
import { demoQuestionnaire } from "../demoData"

interface Props {
  data: QuestionnaireType
  onChange: (q: QuestionnaireType) => void
  onNext: () => void
  onBack: () => void
}

const PAIN_LOCATIONS = [
  "Front of knee",
  "Back of knee",
  "Inside (medial)",
  "Outside (lateral)",
  "Around kneecap",
  "Diffuse / whole knee",
]
const DURATION_OPTIONS = [
  "< 1 week",
  "1–4 weeks",
  "1–3 months",
  "> 3 months",
  "Years / chronic",
]
const ONSET_OPTIONS = [
  "Sudden injury",
  "Gradual onset",
  "Post-activity",
  "After sports / exercise",
  "Unknown",
]
const ACTIVITIES = [
  "Walking (flat)",
  "Running",
  "Stairs (up)",
  "Stairs (down)",
  "Squatting",
  "Kneeling",
  "Sitting prolonged",
  "Standing prolonged",
  "Night pain",
  "Rest pain",
]
const SYMPTOMS = [
  "Swelling",
  "Warmth / redness",
  "Clicking / crepitus",
  "Locking",
  "Giving way (instability)",
  "Stiffness (morning)",
  "Stiffness (after rest)",
  "Weakness",
]
const INJURY_HISTORY = [
  "Fall / direct trauma",
  "Twisting injury",
  "Sports collision",
  "Previous ACL/ligament tear",
  "Previous knee surgery",
  "Previous physio for same knee",
  "Family history of knee OA",
]
const SAFETY_QUESTIONS: Array<{
  key: keyof QuestionnaireType["safety_answers"]
  label: string
}> = [
  {
    key: "fever_or_unwell",
    label: "Fever, chills, or feeling systemically unwell",
  },
  {
    key: "unable_to_bear_weight",
    label: "Unable to bear weight on the affected leg",
  },
  {
    key: "recent_major_trauma",
    label: "Recent major fall, collision, or direct trauma",
  },
  { key: "rapid_swelling", label: "Rapid swelling within the last 24 hours" },
  { key: "calf_pain_or_swelling", label: "New calf pain or swelling" },
  {
    key: "numbness_or_weakness",
    label: "New numbness or weakness in the leg or foot",
  },
  { key: "recent_surgery", label: "Recent surgery or procedure on this leg" },
  {
    key: "unexplained_night_pain",
    label: "Unexplained severe night pain or unexpected weight loss",
  },
]

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  color = "#06b6d4",
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (s: string[]) => void
  color?: string
}) {
  function toggle(item: string) {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item],
    )
  }
  return (
    <div>
      <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const sel = selected.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={sel}
              onClick={() => toggle(o)}
              className="px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer"
              style={{
                borderColor: sel ? color : "#1e293b",
                backgroundColor: sel ? `${color}15` : "rgba(15,23,42,0.6)",
                color: sel ? "#e2e8f0" : "#64748b",
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Questionnaire({
  data,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [error, setError] = useState("")

  function set<K extends keyof QuestionnaireType>(
    k: K,
    v: QuestionnaireType[K],
  ) {
    onChange({ ...data, [k]: v })
    setError("")
  }

  function continueToAnalysis() {
    if (
      !data.affected_side ||
      data.pain_locations.length === 0 ||
      !data.duration ||
      !data.onset
    ) {
      setError(
        "Complete affected side, pain location, duration, and onset before continuing.",
      )
      return
    }
    onNext()
  }

  const painColor =
    data.pain_score <= 3
      ? "#10b981"
      : data.pain_score <= 6
        ? "#f59e0b"
        : "#ef4444"

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            Step 4 of 7
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Patient Questionnaire
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Subjective symptoms and clinical history
          </p>
        </div>
        <button
          onClick={() => onChange(demoQuestionnaire)}
          className="px-3 py-1.5 rounded text-xs font-mono border border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          Load Demo
        </button>
      </div>

      <div className="space-y-7">
        {/* Pain Score */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Current Pain Score
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-3xl font-mono font-bold"
                style={{ color: painColor }}
              >
                {data.pain_score}
              </span>
              <span className="text-slate-500 text-sm">/10</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={data.pain_score}
            onChange={(e) => set("pain_score", Number(e.target.value))}
            className="w-full mb-3"
          />
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <span>0 — No pain</span>
            <span>5 — Moderate</span>
            <span>10 — Worst possible</span>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => set("pain_score", n)}
                className="w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    data.pain_score === n ? painColor : "#1e293b",
                  color: data.pain_score === n ? "#fff" : "#64748b",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Affected Side
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(["Left", "Right", "Both"] as const).map((side) => (
              <button
                key={side}
                type="button"
                aria-pressed={data.affected_side === side}
                onClick={() => set("affected_side", side)}
                className="px-3 py-2 rounded-lg text-sm border transition-all cursor-pointer"
                style={{
                  borderColor:
                    data.affected_side === side ? "#06b6d4" : "#1e293b",
                  color: data.affected_side === side ? "#e2e8f0" : "#64748b",
                  backgroundColor:
                    data.affected_side === side
                      ? "rgba(6,182,212,0.08)"
                      : "transparent",
                }}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* Pain Location */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <MultiSelect
            label="Pain Location (select all that apply)"
            options={PAIN_LOCATIONS}
            selected={data.pain_locations}
            onChange={(v) => set("pain_locations", v)}
            color="#06b6d4"
          />
        </div>

        {/* Duration & Onset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Duration of Symptoms
            </p>
            <div className="space-y-1.5">
              {DURATION_OPTIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => set("duration", o)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm border transition-all cursor-pointer"
                  style={{
                    borderColor: data.duration === o ? "#06b6d4" : "#1e293b",
                    backgroundColor:
                      data.duration === o
                        ? "rgba(6,182,212,0.08)"
                        : "transparent",
                    color: data.duration === o ? "#e2e8f0" : "#64748b",
                  }}
                >
                  {data.duration === o ? "● " : "○ "}
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Symptom Onset
            </p>
            <div className="space-y-1.5">
              {ONSET_OPTIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => set("onset", o)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm border transition-all cursor-pointer"
                  style={{
                    borderColor: data.onset === o ? "#06b6d4" : "#1e293b",
                    backgroundColor:
                      data.onset === o ? "rgba(6,182,212,0.08)" : "transparent",
                    color: data.onset === o ? "#e2e8f0" : "#64748b",
                  }}
                >
                  {data.onset === o ? "● " : "○ "}
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Aggravating Activities */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <MultiSelect
            label="Aggravating Activities"
            options={ACTIVITIES}
            selected={data.aggravating_activities}
            onChange={(v) => set("aggravating_activities", v)}
            color="#f59e0b"
          />
        </div>

        {/* Symptoms */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <MultiSelect
            label="Associated Symptoms"
            options={SYMPTOMS}
            selected={data.symptoms}
            onChange={(v) => set("symptoms", v)}
            color="#f97316"
          />

          {/* Red flag warning */}
          {(data.symptoms.includes("Warmth / redness") ||
            data.symptoms.includes("Swelling")) &&
            data.pain_score >= 7 && (
              <div className="mt-4 flex items-start gap-3 p-3 rounded-lg border border-red-900/50 bg-red-950/30">
                <span className="text-red-400 mt-0.5">⚠</span>
                <div>
                  <p className="text-xs font-semibold text-red-400">
                    Potential Red Flags Detected
                  </p>
                  <p className="text-xs text-red-300/70 mt-0.5">
                    Significant swelling/warmth with high pain score. Medical
                    evaluation may be appropriate.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Injury History */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <MultiSelect
            label="Injury / Medical History"
            options={INJURY_HISTORY}
            selected={data.injury_history}
            onChange={(v) => set("injury_history", v)}
            color="#8b5cf6"
          />
        </div>

        <div className="rounded-xl border border-red-950/70 bg-red-950/10 p-5">
          <p className="text-xs font-mono text-red-300 uppercase tracking-wider mb-1">
            Safety Screen
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Select every statement that currently applies. These answers can
            override routine guidance.
          </p>
          <div className="space-y-2">
            {SAFETY_QUESTIONS.map((item) => {
              const selected = data.safety_answers[item.key]
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    set("safety_answers", {
                      ...data.safety_answers,
                      [item.key]: !selected,
                    })
                  }
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all cursor-pointer"
                  style={{
                    borderColor: selected ? "#ef4444" : "#1e293b",
                    color: selected ? "#fecaca" : "#94a3b8",
                    backgroundColor: selected
                      ? "rgba(239,68,68,0.09)"
                      : "transparent",
                  }}
                >
                  <span className="font-mono mr-2">
                    {selected ? "[x]" : "[ ]"}
                  </span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg text-sm font-medium text-slate-400 border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex flex-col items-end gap-2">
          {error && (
            <p
              role="alert"
              className="max-w-sm text-right text-xs text-red-400"
            >
              {error}
            </p>
          )}
          <button
            onClick={continueToAnalysis}
            className="px-8 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}
          >
            Run Rules Assessment →
          </button>
        </div>
      </div>
    </div>
  )
}
