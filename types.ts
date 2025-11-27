export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: ActivityLevel;
  goal: HealthGoal;
  dietaryPreference: DietType;
  restrictions: string; // Allergies or medical conditions
}

export enum ActivityLevel {
  SEDENTARY = "Sedentary (office job, little exercise)",
  LIGHTLY_ACTIVE = "Lightly Active (1-3 days/week)",
  MODERATELY_ACTIVE = "Moderately Active (3-5 days/week)",
  VERY_ACTIVE = "Very Active (6-7 days/week)",
  EXTRA_ACTIVE = "Extra Active (physical job & exercise)",
}

export enum HealthGoal {
  LOSE_WEIGHT = "Lose Weight",
  MAINTAIN = "Maintain Weight",
  GAIN_MUSCLE = "Gain Muscle",
  IMPROVE_STAMINA = "Improve Stamina",
  REDUCE_STRESS = "Reduce Stress & Better Sleep",
}

export enum DietType {
  ANY = "No Preference",
  VEGETARIAN = "Vegetarian",
  VEGAN = "Vegan",
  KETO = "Ketogenic",
  PALEO = "Paleo",
  MEDITERRANEAN = "Mediterranean",
  GLUTEN_FREE = "Gluten Free",
}

export interface MacroNutrients {
  protein: number; // percentage
  carbs: number; // percentage
  fats: number; // percentage
  calories: number; // daily target
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  tags: string[];
}

export interface DailyDiet {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

export interface ExerciseItem {
  day: string;
  activity: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface Habit {
  title: string;
  description: string;
  frequency: string;
}

export interface WellnessPlan {
  introduction: string;
  macros: MacroNutrients;
  dietPlan: DailyDiet[];
  exercisePlan: ExerciseItem[];
  habits: Habit[];
  disclaimer: string;
}