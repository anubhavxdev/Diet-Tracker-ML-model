import React, { useState, useEffect } from 'react';
import { WellnessPlan, Meal } from '../types';
import MacroChart from './MacroChart';
import { Flame, CheckCircle, Clock, Info, Dumbbell, Apple, Droplet, Calendar, CheckSquare, Square, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlanDashboardProps {
  plan: WellnessPlan;
  onReset: () => void;
}

interface DailyProgress {
  habits: string[];
  exercises: string[];
}

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onReset }) => {
  // Tracker State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [trackerData, setTrackerData] = useState<Record<string, DailyProgress>>({});

  useEffect(() => {
    const saved = localStorage.getItem('vitality_tracker_data');
    if (saved) {
      setTrackerData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(trackerData).length > 0) {
      localStorage.setItem('vitality_tracker_data', JSON.stringify(trackerData));
    }
  }, [trackerData]);

  const toggleHabit = (habitTitle: string) => {
    setTrackerData(prev => {
      const current = prev[selectedDate] || { habits: [], exercises: [] };
      const habits = current.habits.includes(habitTitle)
        ? current.habits.filter(h => h !== habitTitle)
        : [...current.habits, habitTitle];
      return { ...prev, [selectedDate]: { ...current, habits } };
    });
  };

  const toggleExercise = (exerciseDay: string) => {
    setTrackerData(prev => {
      const current = prev[selectedDate] || { habits: [], exercises: [] };
      const exercises = current.exercises.includes(exerciseDay)
        ? current.exercises.filter(e => e !== exerciseDay)
        : [...current.exercises, exerciseDay];
      return { ...prev, [selectedDate]: { ...current, exercises } };
    });
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const currentProgress = trackerData[selectedDate] || { habits: [], exercises: [] };
  const habitsCompleted = currentProgress.habits.length;
  const totalHabits = plan.habits.length;
  const exercisesCompleted = currentProgress.exercises.length;

  const completionPercentage = totalHabits > 0 
    ? Math.round(((habitsCompleted + (exercisesCompleted > 0 ? 1 : 0)) / (totalHabits + 1)) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your Personalized Wellness Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{plan.introduction}</p>
      </div>

      {/* Progress Tracker Section (NEW) */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-primary-600 p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <Trophy size={28} className="text-yellow-300" />
             <div>
               <h2 className="text-2xl font-bold">Daily Progress Tracker</h2>
               <p className="text-primary-100 text-sm">Stay consistent with your goals</p>
             </div>
          </div>
          <div className="flex items-center bg-primary-700/50 rounded-xl p-1">
             <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition"><ChevronLeft size={20} /></button>
             <div className="px-4 font-mono font-medium flex items-center gap-2">
               <Calendar size={16} />
               {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
             <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/10 rounded-lg transition"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Daily Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Habits Checklist */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-primary-500" /> Habits
              </h3>
              <div className="space-y-3">
                {plan.habits.map((habit, idx) => {
                  const isCompleted = currentProgress.habits.includes(habit.title);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleHabit(habit.title)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 group ${
                        isCompleted 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'bg-white border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className={`mt-0.5 transition-colors ${isCompleted ? 'text-primary-600' : 'text-gray-300 group-hover:text-primary-400'}`}>
                        {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <div>
                        <span className={`font-medium block ${isCompleted ? 'text-primary-800 line-through decoration-primary-300' : 'text-gray-700'}`}>
                          {habit.title}
                        </span>
                        <span className="text-xs text-gray-400">{habit.frequency}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exercise Log */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Dumbbell size={20} className="text-blue-500" /> Workout Log
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 italic mb-2">Select the workout you completed today:</p>
                {plan.exercisePlan.map((item, idx) => {
                   const isCompleted = currentProgress.exercises.includes(item.day);
                   return (
                    <button
                      key={idx}
                      onClick={() => toggleExercise(item.day)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group ${
                        isCompleted 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        <span className={`font-semibold text-sm block ${isCompleted ? 'text-blue-800' : 'text-gray-800'}`}>
                          {item.day}
                        </span>
                        <span className={`text-xs block ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                          {item.activity}
                        </span>
                      </div>
                      <div className={`transition-colors ${isCompleted ? 'text-blue-600' : 'text-gray-300 group-hover:text-blue-400'}`}>
                        {isCompleted ? <CheckCircle size={20} fill="currentColor" className="text-white" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
                      </div>
                    </button>
                   )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macros & Habits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Macros Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Daily Targets</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <span className="text-5xl font-extrabold text-gray-900">{plan.macros.calories}</span>
              <span className="text-gray-500 ml-2 font-medium">kcal / day</span>
            </div>
            <MacroChart macros={plan.macros} />
          </div>
        </div>

        {/* Habits Card (Reference) */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="text-primary-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Habit Details</h2>
          </div>
          <div className="space-y-4">
            {plan.habits.map((habit, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-primary-50 transition border border-gray-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full border-2 border-primary-300 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-lg">
                    {habit.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diet Plan */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Apple className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">3-Day Meal Plan</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plan.dietPlan.map((day, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold text-primary-700 bg-primary-50 inline-block px-3 py-1 rounded-lg">
                  {day.day}
                </h3>
                <MealCard title="Breakfast" meal={day.breakfast} />
                <MealCard title="Lunch" meal={day.lunch} />
                <MealCard title="Dinner" meal={day.dinner} />
                <MealCard title="Snack" meal={day.snack} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Plan */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Dumbbell className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Exercise Roadmap</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Day</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Activity</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Duration</th>
                <th className="pb-4 font-semibold text-gray-500 text-sm uppercase tracking-wider">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plan.exercisePlan.map((item, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 transition">
                  <td className="py-4 pr-4 font-medium text-gray-900">{item.day}</td>
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-gray-800">{item.activity}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <Clock size={14} className="mr-1" /> {item.duration}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${item.intensity === 'High' ? 'bg-red-100 text-red-700' : 
                        item.intensity === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {item.intensity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <Info className="text-blue-500 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-bold text-blue-900">Medical Disclaimer</h4>
          <p className="text-blue-800 text-sm mt-1 leading-relaxed">
            {plan.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

const MealCard: React.FC<{ title: string; meal: Meal }> = ({ title, meal }) => (
  <div className="bg-gray-50 rounded-2xl p-4 hover:shadow-md transition duration-300 border border-transparent hover:border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{title}</span>
      <span className="text-xs font-semibold text-primary-600 bg-white px-2 py-0.5 rounded-md shadow-sm">
        {meal.calories} kcal
      </span>
    </div>
    <h4 className="font-bold text-gray-900 mb-1 leading-tight">{meal.name}</h4>
    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{meal.description}</p>
    <div className="flex flex-wrap gap-1">
      {meal.tags.map((tag, i) => (
        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default PlanDashboard;