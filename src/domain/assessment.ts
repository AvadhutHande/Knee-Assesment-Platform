import type {
  AnalysisResults,
  Questionnaire,
  SafetyFlag,
  SafetySeverity,
  SensorData,
} from "../types"

const SEVERITY_ORDER: Record<SafetySeverity, number> = {
  routine: 0,
  prompt: 1,
  urgent: 2,
  emergency: 3,
}

export function evaluateSafety(sensor: SensorData, q: Questionnaire): {
  severity: SafetySeverity
  flags: SafetyFlag[]
} {
  const flags: SafetyFlag[] = []
  const add = (flag: SafetyFlag) => flags.push(flag)
  const hasHotSwollenKnee =
    q.symptoms.includes("Warmth / redness") && q.symptoms.includes("Swelling")
  const tempDiff = Math.abs(
    sensor.temperature.left_knee - sensor.temperature.right_knee,
  )

  if (
    hasHotSwollenKnee &&
    (q.safety_answers.fever_or_unwell || q.pain_score >= 7)
  ) {
    add({
      id: "hot-swollen-knee",
      severity: "emergency",
      title: "Hot, swollen knee with systemic symptoms or severe pain",
      detail:
        "This combination needs urgent in-person assessment to exclude a serious inflammatory or infective cause.",
      action:
        "Seek urgent medical care now. Do not begin an exercise programme from this assessment.",
    })
  }
  if (
    q.safety_answers.recent_major_trauma &&
    q.safety_answers.unable_to_bear_weight
  ) {
    add({
      id: "trauma-unable-weight-bear",
      severity: "emergency",
      title: "Major trauma with inability to bear weight",
      detail: "A fracture or significant structural injury must be excluded.",
      action:
        "Seek urgent medical care now and avoid loading the affected leg.",
    })
  }
  if (q.safety_answers.calf_pain_or_swelling) {
    add({
      id: "calf-symptoms",
      severity: "urgent",
      title: "Calf pain or swelling reported",
      detail:
        "Calf symptoms require prompt clinical assessment, particularly after reduced mobility or surgery.",
      action:
        "Contact a medical professional promptly for an in-person assessment.",
    })
  }
  if (q.safety_answers.numbness_or_weakness) {
    add({
      id: "neurological-symptoms",
      severity: "urgent",
      title: "New numbness or weakness reported",
      detail:
        "Neurological symptoms are outside the scope of this screening tool.",
      action: "Arrange prompt medical assessment.",
    })
  }
  if (q.symptoms.includes("Locking")) {
    add({
      id: "mechanical-locking",
      severity: "prompt",
      title: "Mechanical locking reported",
      detail:
        "A knee that physically cannot move through its usual range may need structural assessment.",
      action:
        "Arrange assessment by a qualified clinician before progressing exercise.",
    })
  }
  if (
    q.safety_answers.rapid_swelling ||
    q.safety_answers.unable_to_bear_weight
  ) {
    add({
      id: "acute-function-loss",
      severity: "urgent",
      title: "Rapid swelling or inability to bear weight",
      detail: "This can indicate an acute injury requiring timely examination.",
      action: "Seek prompt in-person medical assessment.",
    })
  }
  if (
    q.safety_answers.recent_surgery ||
    q.safety_answers.unexplained_night_pain
  ) {
    add({
      id: "clinical-review",
      severity: "prompt",
      title: "Clinical review recommended",
      detail:
        "Recent surgery or unexplained night pain should be interpreted by the treating clinician.",
      action:
        "Contact the treating team or a qualified clinician before relying on this assessment.",
    })
  }
  if (tempDiff > 2) {
    add({
      id: "thermal-asymmetry",
      severity: "prompt",
      title: "Marked temperature asymmetry",
      detail:
        "The bilateral temperature difference is greater than the prototype threshold of 2°C.",
      action:
        "Correlate this finding with symptoms and a clinical examination.",
    })
  }

  const severity = flags.reduce<SafetySeverity>(
    (highest, flag) =>
      SEVERITY_ORDER[flag.severity] > SEVERITY_ORDER[highest]
        ? flag.severity
        : highest,
    "routine",
  )
  return { severity, flags }
}

export function validateSensorData(sensor: SensorData): string[] {
  const errors: string[] = []
  const values = [
    ...Object.values(sensor.imu),
    ...Object.values(sensor.pressure),
    ...Object.values(sensor.emg),
    ...Object.values(sensor.temperature),
    ...Object.values(sensor.camera),
  ]
  if (values.some((value) => !Number.isFinite(value))) {
    errors.push("Every sensor field must contain a finite number.")
  }
  const loadTotal =
    sensor.pressure.left_load_pct + sensor.pressure.right_load_pct
  if (Math.abs(loadTotal - 100) > 0.5) {
    errors.push(
      `Left and right loading must total 100% (currently ${loadTotal.toFixed(1)}%).`,
    )
  }
  if (
    sensor.imu.rom_left > sensor.imu.max_flexion_left ||
    sensor.imu.rom_right > sensor.imu.max_flexion_right
  ) {
    errors.push(
      "Knee ROM cannot be greater than the corresponding maximum flexion value.",
    )
  }
  if (
    sensor.temperature.left_knee <= sensor.temperature.ambient ||
    sensor.temperature.right_knee <= sensor.temperature.ambient
  ) {
    errors.push(
      "Knee surface temperatures should be greater than ambient temperature; confirm the entries and units.",
    )
  }
  return errors
}

export function computeResults(
  sensor: SensorData,
  q: Questionnaire,
): AnalysisResults {
  const romAsym = Math.abs(sensor.imu.rom_left - sensor.imu.rom_right)
  const loadAsym = Math.abs(
    sensor.pressure.left_load_pct - sensor.pressure.right_load_pct,
  )
  const quadAsym = Math.abs(sensor.emg.quad_left - sensor.emg.quad_right) * 100
  const hamAsym =
    Math.abs(sensor.emg.hamstring_left - sensor.emg.hamstring_right) * 100
  const tempDiff = Math.abs(
    sensor.temperature.left_knee - sensor.temperature.right_knee,
  )
  const movementScore = Math.max(
    0,
    100 -
      romAsym * 1.5 -
      (100 - sensor.imu.movement_smoothness * 100) * 0.3 -
      (100 - sensor.imu.stride_symmetry * 100) * 0.3,
  )
  const loadingScore = Math.max(0, 100 - loadAsym * 1.8)
  const muscleScore = Math.max(
    0,
    100 - quadAsym * 1.2 - hamAsym * 0.8 - sensor.emg.fatigue_index * 30,
  )
  const safety = evaluateSafety(sensor, q)

  const anteriorIndicators = [
    q.pain_locations.some((l) => l.includes("Front") || l.includes("kneecap")),
    q.aggravating_activities.some(
      (a) => a.includes("Stairs") || a.includes("Squatting"),
    ),
    romAsym > 10,
    loadAsym > 10,
    quadAsym > 20,
    sensor.camera.valgus_right > 8,
  ]
  const anteriorMatches = anteriorIndicators.filter(Boolean).length
  const isAnterior = anteriorMatches >= 3
  const isMeniscal =
    q.symptoms.includes("Clicking / crepitus") || q.symptoms.includes("Locking")
  const isInstability =
    q.symptoms.includes("Giving way (instability)") ||
    q.injury_history.includes("Previous ACL/ligament tear")
  const isInflammatory =
    q.symptoms.includes("Swelling") && q.symptoms.includes("Warmth / redness")

  let pattern = "Non-specific Knee Dysfunction Pattern"
  let patternDescription =
    "Movement and loading differences are present without a dominant configured pattern."
  let confidence: AnalysisResults["pattern_confidence"] = "Low"
  let matchSummary = "No configured pattern matched at least three indicators."

  if (isInflammatory) {
    pattern = "Inflammatory / Reactive Pattern"
    patternDescription =
      "Reported swelling and warmth match the prototype inflammatory rule. This is not a diagnosis."
    confidence = "Moderate"
    matchSummary =
      "Swelling and warmth matched 2 configured inflammatory indicators."
  } else if (isInstability) {
    pattern = "Ligamentous Instability Pattern"
    patternDescription =
      "Reported giving way or ligament history matches the prototype instability rule."
    confidence = "Moderate"
    matchSummary = "At least 1 configured instability indicator was present."
  } else if (isMeniscal && !isAnterior) {
    pattern = "Meniscal / Intra-articular Pattern"
    patternDescription =
      "Mechanical symptoms match the prototype intra-articular rule and warrant clinical interpretation."
    confidence = "Moderate"
    matchSummary =
      "At least 1 configured mechanical-symptom indicator was present."
  } else if (isAnterior) {
    pattern = "Anterior Knee Pain / Patellofemoral-type Pattern"
    patternDescription =
      "The reported symptom location and activities, together with measured asymmetries, match the configured anterior-knee pattern."
    confidence = anteriorMatches >= 5 ? "High" : "Moderate"
    matchSummary = `${anteriorMatches} of 6 configured anterior-knee indicators matched.`
  }

  const secondary = [
    {
      name: "Anterior knee feature match",
      probability: Math.round((anteriorMatches / 6) * 100),
    },
    {
      name: "Lateral pain feature match",
      probability: q.pain_locations.includes("Outside (lateral)") ? 50 : 0,
    },
    {
      name: "Mechanical symptom feature match",
      probability: isMeniscal ? 50 : 0,
    },
  ]
    .filter((p) => p.probability > 0)
    .sort((a, b) => b.probability - a.probability)

  const recommendations: string[] = []
  if (safety.severity === "emergency" || safety.severity === "urgent") {
    recommendations.push(
      "Routine exercise guidance is suppressed because the safety screen recommends in-person medical assessment.",
    )
    recommendations.push(...safety.flags.map((flag) => flag.action))
  } else {
    if (romAsym > 15)
      recommendations.push(
        "Discuss the right-sided range-of-motion difference with a physiotherapist.",
      )
    if (loadAsym > 10)
      recommendations.push(
        "Consider clinician-guided gait and loading assessment.",
      )
    if (quadAsym > 20)
      recommendations.push(
        "Consider clinician-guided quadriceps activation and strengthening.",
      )
    if (sensor.camera.valgus_right > 8)
      recommendations.push(
        "Consider professional assessment of dynamic knee alignment.",
      )
    recommendations.push(
      "Repeat the same standardized assessment to monitor change over time.",
    )
  }

  return {
    rom_asymmetry: romAsym,
    loading_asymmetry: loadAsym,
    quad_asymmetry: quadAsym,
    hamstring_asymmetry: hamAsym,
    temp_difference: tempDiff,
    movement_score: Math.round(movementScore),
    loading_score: Math.round(loadingScore),
    muscle_score: Math.round(muscleScore),
    camera_imu_agreement: Math.max(
      0,
      Math.round(
        100 -
          Math.abs(
            (sensor.imu.rom_left + sensor.imu.rom_right) / 2 -
              (sensor.camera.knee_angle_left + sensor.camera.knee_angle_right) /
                2,
          ) *
            2,
      ),
    ),
    pain_score: q.pain_score,
    functional_score: Math.round(
      (movementScore + loadingScore + muscleScore) / 3,
    ),
    pattern,
    pattern_description: patternDescription,
    pattern_confidence: confidence,
    match_summary: matchSummary,
    algorithm_version: "Rules prototype 1.0",
    safety_severity: safety.severity,
    safety_flags: safety.flags,
    red_flags: safety.flags.map((flag) => flag.title),
    secondary_patterns: secondary,
    recommendations: [...new Set(recommendations)],
  }
}
