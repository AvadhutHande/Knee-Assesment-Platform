import { useState } from "react"
import type { AppState, Questionnaire } from "./types"
import { demoSensorData } from "./demoData"
import { computeResults } from "./domain/assessment"

import Welcome from "./components/Welcome"
import UserProfile from "./components/UserProfile"
import ModeSelect from "./components/ModeSelect"
import HardwareConnect from "./components/HardwareConnect"
import ManualEntry from "./components/ManualEntry"
import QuestionnaireScreen from "./components/Questionnaire"
import Processing from "./components/Processing"
import Results from "./components/Results"

const EMPTY_PROFILE = {
  name: "",
  ageRange: "",
  height: "",
  weight: "",
  activityLevel: "",
  history: [],
}
const EMPTY_Q: Questionnaire = {
  pain_score: 0,
  affected_side: "",
  pain_locations: [],
  duration: "",
  onset: "",
  aggravating_activities: [],
  symptoms: [],
  injury_history: [],
  safety_answers: {
    fever_or_unwell: false,
    unable_to_bear_weight: false,
    recent_major_trauma: false,
    rapid_swelling: false,
    calf_pain_or_swelling: false,
    numbness_or_weakness: false,
    recent_surgery: false,
    unexplained_night_pain: false,
  },
}

const STEPS: Record<AppState["screen"], number> = {
  welcome: 0,
  profile: 1,
  "mode-select": 2,
  hardware: 3,
  manual: 3,
  questionnaire: 4,
  acquisition: 5,
  processing: 6,
  results: 7,
}

function StepBar({ screen }: { screen: AppState["screen"] }) {
  const step = STEPS[screen]
  if (step === 0) return null
  return (
    <div className="flex gap-1.5 mb-6">
      {[1, 2, 3, 4, 5, 6, 7].map((s) => (
        <div
          key={s}
          className="h-1 flex-1 rounded-full transition-all duration-500"
          style={{
            backgroundColor:
              s < step ? "#06b6d4" : s === step ? "#06b6d4" : "#1e293b",
            opacity: s === step ? 1 : s < step ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: "welcome",
    mode: null,
    profile: EMPTY_PROFILE,
    sensorData: demoSensorData,
    questionnaire: EMPTY_Q,
    dataSource: "demo",
    results: null,
  })

  function go(screen: AppState["screen"]) {
    setState((s) => ({ ...s, screen }))
  }

  function handleRunAnalysis() {
    go("processing")
  }

  function handleProcessingComplete() {
    const results = computeResults(state.sensorData, state.questionnaire)
    setState((s) => ({ ...s, results, screen: "results" }))
  }

  function restart() {
    setState({
      screen: "welcome",
      mode: null,
      profile: EMPTY_PROFILE,
      sensorData: demoSensorData,
      questionnaire: EMPTY_Q,
      dataSource: "demo",
      results: null,
    })
  }

  const { screen } = state

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #050b17 0%, #070d1a 50%, #080f1e 100%)",
      }}
    >
      {/* Top nav for non-welcome screens */}
      {screen !== "welcome" && screen !== "processing" && (
        <header
          className="sticky top-0 z-50 border-b border-slate-800/60"
          style={{
            background: "rgba(7,13,26,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <ellipse
                  cx="12"
                  cy="9"
                  rx="3"
                  ry="4"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="12"
                  cy="16"
                  rx="2.5"
                  ry="3"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-sm font-semibold text-white">
                KneeSense AI
              </span>
              {state.mode && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{
                    background:
                      state.mode === "hardware"
                        ? "rgba(6,182,212,0.1)"
                        : "rgba(16,185,129,0.1)",
                    color: state.mode === "hardware" ? "#06b6d4" : "#10b981",
                    border: `1px solid ${
                      state.mode === "hardware"
                        ? "rgba(6,182,212,0.2)"
                        : "rgba(16,185,129,0.2)"
                    }`,
                  }}
                >
                  {state.dataSource === "simulated-hardware"
                    ? "Hardware simulation"
                    : state.dataSource === "demo"
                      ? "Demo data"
                      : state.dataSource}
                </span>
              )}
            </div>
            {state.profile.name && (
              <span className="text-xs text-slate-500 font-mono">
                {state.profile.name}
              </span>
            )}
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-0">
            <StepBar screen={screen} />
          </div>
        </header>
      )}

      <main>
        {screen === "welcome" && <Welcome onStart={() => go("profile")} />}

        {screen === "profile" && (
          <UserProfile
            profile={state.profile}
            onChange={(profile) => setState((s) => ({ ...s, profile }))}
            onNext={() => go("mode-select")}
          />
        )}

        {screen === "mode-select" && (
          <ModeSelect
            onSelect={(mode) =>
              setState((s) => ({
                ...s,
                mode,
                screen: mode === "hardware" ? "hardware" : "manual",
              }))
            }
          />
        )}

        {screen === "hardware" && (
          <HardwareConnect
            onConnected={(sensorData) =>
              setState((s) => ({
                ...s,
                sensorData,
                dataSource: "simulated-hardware",
                screen: "questionnaire",
              }))
            }
          />
        )}

        {screen === "manual" && (
          <ManualEntry
            data={state.sensorData}
            onChange={(sensorData) =>
              setState((s) => ({ ...s, sensorData, dataSource: "manual" }))
            }
            onLoadDemo={() =>
              setState((s) => ({
                ...s,
                sensorData: demoSensorData,
                dataSource: "demo",
              }))
            }
            onNext={() => go("questionnaire")}
          />
        )}

        {screen === "questionnaire" && (
          <QuestionnaireScreen
            data={state.questionnaire}
            onChange={(questionnaire) =>
              setState((s) => ({ ...s, questionnaire }))
            }
            onNext={handleRunAnalysis}
            onBack={() => go(state.mode === "hardware" ? "hardware" : "manual")}
          />
        )}

        {screen === "processing" && (
          <Processing onComplete={handleProcessingComplete} />
        )}

        {screen === "results" && state.results && (
          <Results
            results={state.results}
            sensor={state.sensorData}
            questionnaire={state.questionnaire}
            profile={state.profile}
            dataSource={state.dataSource}
            onRestart={restart}
          />
        )}
      </main>
    </div>
  )
}
