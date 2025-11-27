import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WellnessPlan } from "../types";

export const generateWellnessPlan = async (userProfile: UserProfile): Promise<WellnessPlan> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is set in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a comprehensive health and wellness plan for the following user:
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Weight: ${userProfile.weight}kg
    - Height: ${userProfile.height}cm
    - Activity Level: ${userProfile.activityLevel}
    - Primary Goal: ${userProfile.goal}
    - Dietary Preference: ${userProfile.dietaryPreference}
    - Medical History/Restrictions: ${userProfile.restrictions || "None"}

    The plan should include:
    1. A calculated daily calorie target and macro split (protein, carbs, fats in percentages).
    2. A 3-day sample diet plan (Day 1, Day 2, Day 3) with Breakfast, Lunch, Dinner, and Snack.
    3. A weekly exercise roadmap (giving examples for Mon-Sun or specific workout days).
    4. 3-5 healthy habits to build.
    5. A friendly introduction and a strong medical disclaimer.
    
    Ensure the tone is encouraging, educational, and clear.
    IMPORTANT: Provide purely educational guidance. Do not provide medical prescriptions.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      introduction: { type: Type.STRING, description: "A brief, encouraging personalized summary of the plan." },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.NUMBER, description: "Percentage of daily calories from protein" },
          carbs: { type: Type.NUMBER, description: "Percentage of daily calories from carbs" },
          fats: { type: Type.NUMBER, description: "Percentage of daily calories from fats" },
          calories: { type: Type.NUMBER, description: "Total daily calorie target" },
        },
        required: ["protein", "carbs", "fats", "calories"]
      },
      dietPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "e.g., 'Day 1'" },
            breakfast: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "description", "calories"]
            },
            lunch: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "description", "calories"]
            },
            dinner: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "description", "calories"]
            },
            snack: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "description", "calories"]
            },
          },
          required: ["day", "breakfast", "lunch", "dinner", "snack"]
        }
      },
      exercisePlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "e.g., 'Monday' or 'Workout A'" },
            activity: { type: Type.STRING },
            duration: { type: Type.STRING },
            intensity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            notes: { type: Type.STRING }
          },
          required: ["day", "activity", "duration", "intensity", "notes"]
        }
      },
      habits: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            frequency: { type: Type.STRING }
          },
          required: ["title", "description", "frequency"]
        }
      },
      disclaimer: { type: Type.STRING, description: "A necessary medical disclaimer." }
    },
    required: ["introduction", "macros", "dietPlan", "exercisePlan", "habits", "disclaimer"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as WellnessPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate wellness plan. Please try again.");
  }
};