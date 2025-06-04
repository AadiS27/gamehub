"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Bug, Trophy, Zap } from "lucide-react";

import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-6">
            GameHub
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-300 mb-8 max-w-2xl mx-auto">
            Find bugs. Earn XP. Level up. Compete with friends.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-slate-900/50 border-t border-purple-500/30 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30 transform transition-transform hover:scale-105">
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Bug className="text-purple-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Find Bugs</h3>
              <p className="text-purple-300">Challenge yourself with coding puzzles and identify bugs in real code snippets.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30 transform transition-transform hover:scale-105">
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-yellow-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Earn XP</h3>
              <p className="text-purple-300">Gain experience points with each challenge you complete. Level up as you improve.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30 transform transition-transform hover:scale-105">
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="text-yellow-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compete</h3>
              <p className="text-purple-300">See how you stack up against other developers on the global leaderboard.</p>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}