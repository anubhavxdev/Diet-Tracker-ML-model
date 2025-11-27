import { ActivityLevel, DietType, HealthGoal } from "./types";

export const ACTIVITY_LEVELS = Object.values(ActivityLevel);
export const HEALTH_GOALS = Object.values(HealthGoal);
export const DIET_TYPES = Object.values(DietType);

export const MOCK_LOADING_MESSAGES = [
  "Analyzing your health profile...",
  "Calculating optimal macronutrient splits...",
  "Designing your custom meal plan...",
  "Structuring your workout roadmap...",
  "Curating healthy habits for you...",
  "Finalizing your wellness blueprint..."
];