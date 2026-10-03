export interface UserProfile {
  name: string
  ageRange: string
  height: string
  weight: string
  activityLevel: string
  history: string[]
}

export interface IMUData {
  rom_left: number
  rom_right: number
  max_flexion_left: number
  max_flexion_right: number
  extension_deficit_left: number
  extension_deficit_right: number
  angular_velocity_peak: number
  movement_smoothness: number
  gait_cycle_time: number
  stride_symmetry: number
  raw_thigh_acc_x: number
  raw_thigh_acc_y: number
  raw_thigh_acc_z: number
  raw_thigh_gyro_x: number
  raw_thigh_gyro_y: number
  raw_thigh_gyro_z: number
  raw_shin_acc_x: number
  raw_shin_acc_y: number
  raw_shin_acc_z: number
  raw_shin_gyro_x: number
  raw_shin_gyro_y: number
  raw_shin_gyro_z: number
}

export interface PressureData {
  left_p1: number
  left_p2: number
  left_p3: number
  left_p4: number
  left_p5: number
  left_p6: number
  left_p7: number
  left_p8: number
  right_p1: number
  right_p2: number
  right_p3: number
  right_p4: number
  right_p5: number
  right_p6: number
  right_p7: number
  right_p8: number
  left_load_pct: number
  right_load_pct: number
  stance_time_left: number
  stance_time_right: number
  heel_ratio_left: number
  heel_ratio_right: number
}

export interface EMGData {
  quad_left: number
  quad_right: number
  hamstring_left: number
  hamstring_right: number
  gastrocnemius_left: number
  gastrocnemius_right: number
  cocontraction_ratio: number
  fatigue_index: number
}

export interface TemperatureData {
  left_knee: number
  right_knee: number
  ambient: number
}

export interface CameraData {
  knee_angle_left: number
  knee_angle_right: number
  hip_angle: number
  ankle_dorsiflexion: number
  valgus_left: number
  valgus_right: number
  symmetry_score: number
  squat_depth_cm: number
  trunk_lean: number
}

export interface SensorData {
  imu: IMUData
  pressure: PressureData
  emg: EMGData
  temperature: TemperatureData
  camera: CameraData
}

export interface Questionnaire {
  pain_score: number
  affected_side: "Left" | "Right" | "Both" | ""
  pain_locations: string[]
  duration: string
  onset: string
  aggravating_activities: string[]
  symptoms: string[]
  injury_history: string[]
  safety_answers: SafetyAnswers
}

export interface SafetyAnswers {
  fever_or_unwell: boolean
  unable_to_bear_weight: boolean
  recent_major_trauma: boolean
  rapid_swelling: boolean
  calf_pain_or_swelling: boolean
  numbness_or_weakness: boolean
  recent_surgery: boolean
  unexplained_night_pain: boolean
}

export type SafetySeverity = "routine" | "prompt" | "urgent" | "emergency"

export interface SafetyFlag {
  id: string
  severity: Exclude<SafetySeverity, "routine">
  title: string
  detail: string
  action: string
}

export type DataSource = "manual" | "demo" | "simulated-hardware" | "hardware"

export interface AnalysisResults {
  rom_asymmetry: number
  loading_asymmetry: number
  quad_asymmetry: number
  hamstring_asymmetry: number
  temp_difference: number
  movement_score: number
  loading_score: number
  muscle_score: number
  camera_imu_agreement: number
  pain_score: number
  functional_score: number
  pattern: string
  pattern_description: string
  pattern_confidence: "High" | "Moderate" | "Low"
  match_summary: string
  algorithm_version: string
  safety_severity: SafetySeverity
  safety_flags: SafetyFlag[]
  red_flags: string[]
  secondary_patterns: Array<{ name: string probability: number }>
  recommendations: string[]
}

export type Screen = "welcome" | "profile" | "mode-select" | "hardware" | "manual" | "questionnaire" | "acquisition" | "processing" | "results"

export type InputMode = "hardware" | "manual" | null

export interface AppState {
  screen: Screen
  mode: InputMode
  profile: UserProfile
  sensorData: SensorData
  questionnaire: Questionnaire
  dataSource: DataSource
  results: AnalysisResults | null
}
