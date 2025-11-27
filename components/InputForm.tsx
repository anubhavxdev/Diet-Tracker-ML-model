import React, { useState } from 'react';
import { UserProfile, ActivityLevel, HealthGoal, DietType } from '../types';
import { ACTIVITY_LEVELS, HEALTH_GOALS, DIET_TYPES } from '../constants';
import { ChevronRight, Activity, Utensils, User, FileText } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserProfile) => void;
  isGenerating: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    age: 30,
    gender: 'Male',
    weight: 70,
    height: 170,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: HealthGoal.MAINTAIN,
    dietaryPreference: DietType.ANY,
    restrictions: '',
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-2 text-primary-600 mb-4">
        <User size={24} />
        <h2 className="text-xl font-semibold">The Basics</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={nextStep}
        className="w-full mt-6 bg-primary-600 text-white p-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
      >
        Next <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-2 text-primary-600 mb-4">
        <Activity size={24} />
        <h2 className="text-xl font-semibold">Lifestyle & Goals</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
        <select
          value={formData.activityLevel}
          onChange={(e) => handleChange('activityLevel', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
        >
          {ACTIVITY_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
        <div className="grid grid-cols-1 gap-2">
          {HEALTH_GOALS.map(goal => (
            <button
              key={goal}
              type="button"
              onClick={() => handleChange('goal', goal)}
              className={`p-3 rounded-xl text-left border transition ${
                formData.goal === goal
                  ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/3 bg-gray-100 text-gray-700 p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="w-2/3 bg-primary-600 text-white p-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-2 text-primary-600 mb-4">
        <Utensils size={24} />
        <h2 className="text-xl font-semibold">Nutrition</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
        <select
          value={formData.dietaryPreference}
          onChange={(e) => handleChange('dietaryPreference', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
        >
          {DIET_TYPES.map(diet => (
            <option key={diet} value={diet}>{diet}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medical History / Restrictions
          <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
        </label>
        <textarea
          value={formData.restrictions}
          onChange={(e) => handleChange('restrictions', e.target.value)}
          placeholder="E.g., Peanut allergy, history of back pain, lactose intolerance..."
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition h-32 resize-none"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="w-1/3 bg-gray-100 text-gray-700 p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isGenerating}
          onClick={handleSubmit}
          className="w-2/3 bg-primary-600 text-white p-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Plan...' : 'Generate Plan'} <FileText size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full flex-1 mx-1 transition-colors duration-300 ${
                s <= step ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default InputForm;