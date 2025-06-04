'use client'

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Zap, Trophy, Calendar, Clock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage() {
  const userData = useQuery(api.user.getUser, { userId: "currentUser" });
  
  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const joinDate = new Date(); // Use current date since createdAt doesn't exist in userData
  const memberSince = formatDistanceToNow(joinDate, { addSuffix: true });

  // XP progress calculation
  const levelXp = userData.level * 100; // Simple formula for required XP
  const nextLevelXp = (userData.level + 1) * 100;
  const xpProgress = ((userData.exp - levelXp) / (nextLevelXp - levelXp)) * 100;
  
  return (
    <div className=" mx-auto py-8  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="absolute -bottom-16 left-8">
            <div className="rounded-full border-4 border-slate-900 shadow-xl overflow-hidden h-32 w-32">
              {userData.avatar ? (
                <Image 
                  src={userData.avatar} 
                  alt={userData.name} 
                  width={128} 
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-purple-300 flex items-center justify-center">
                  <UserIcon size={48} className="text-purple-800" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Card */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-white mb-4">Player Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" /> Level
                    </span>
                    <span className="text-white font-bold">{userData.level}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${xpProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-400">{userData.exp} XP</span>
                    <span className="text-slate-400">{nextLevelXp} XP</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" /> Total XP
                  </span>
                  <span className="text-white font-bold">{userData.exp}</span>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-white mb-4">Account Info</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Calendar size={16} /> Member Since
                  </span>
                  <span className="text-white">{memberSince}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Clock size={16} /> Last Activity
                  </span>
                  <span className="text-white">Today</span>
                </div>
              </div>
            </div>
            
            {/* Achievements/Badges (placeholder) */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-white mb-4">Achievements</h2>
              
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center"
                    title="Coming soon"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-600/50 flex items-center justify-center">
                      <span className="text-slate-400">?</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-slate-500 text-sm mt-4">Complete tasks to unlock achievements</p>
            </div>
          </div>
          
        
        </div>
      </div>
    </div>
  );
}