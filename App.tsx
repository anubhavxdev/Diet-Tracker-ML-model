import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import PlanDashboard from './components/PlanDashboard';
import { generateWellnessPlan } from './services/geminiService';
import { UserProfile, WellnessPlan } from './types';
import { MOCK_LOADING_MESSAGES } from './constants';
import { Sparkles, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vitality_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(() => {
    const saved = localStorage.getItem('vitality_wellness_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(MOCK_LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('vitality_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('vitality_user_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    if (wellnessPlan) {
      localStorage.setItem('vitality_wellness_plan', JSON.stringify(wellnessPlan));
    } else {
      localStorage.removeItem('vitality_wellness_plan');
    }
  }, [wellnessPlan]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % MOCK_LOADING_MESSAGES.length;
        setLoadingMessage(MOCK_LOADING_MESSAGES[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFormSubmit = async (data: UserProfile) => {
    setUserProfile(data);
    setLoading(true);
    setError(null);
    try {
      const plan = await generateWellnessPlan(data);
      setWellnessPlan(plan);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWellnessPlan(null);
    setUserProfile(null);
    setError(null);
    localStorage.removeItem('vitality_user_profile');
    localStorage.removeItem('vitality_wellness_plan');
    localStorage.removeItem('vitality_tracker_data'); // Optional: clear tracker on full reset
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans selection:bg-primary-200 selection:text-primary-900">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-500 p-2 rounded-xl text-white">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Vitality AI
              </span>
            </div>
            {wellnessPlan && (
               <button 
                 onClick={handleReset}
                 className="text-sm font-medium text-gray-500 hover:text-red-500 transition"
               >
                 New Plan
               </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Crafting Your Plan</h3>
            <p className="text-gray-500 text-lg animate-pulse">{loadingMessage}</p>
          </div>
        ) : error ? (
           <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-fadeIn">
              <h3 className="text-xl font-bold text-red-800 mb-2">Oops!</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Try Again
              </button>
           </div>
        ) : !wellnessPlan ? (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Design Your <span className="text-primary-600">Perfect Lifestyle</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tell us about yourself, and our AI will build a comprehensive nutrition, exercise, and habit roadmap tailored just for you.
              </p>
            </div>
            <div className="w-full">
              <InputForm onSubmit={handleFormSubmit} isGenerating={loading} />
            </div>
          </div>
        ) : (
          <PlanDashboard plan={wellnessPlan} onReset={handleReset} />
        )}
      </main>

    </div>
  );
};

export default App;