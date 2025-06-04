'use client'

import { UserButton } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { Gamepad2, Home, Settings, User, Zap } from "lucide-react"
import { api } from "../../../../convex/_generated/api"
import { useEffect } from "react"

export const Navbar = () => {

  const userData = useQuery(api.user.getUser, { userId: "currentUser" });
  const createUser = useMutation(api.user.create);
  
  // Create user if needed
  useEffect(() => {
    if (userData?.needsCreation) {
      createUser({
        name: userData.name,
        exp: 0,
        level: 1,
        avatar: userData.avatar,
      }).catch((err: Error) => console.error("Failed to create user:", err));
    }
  }, [userData, createUser]);
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-4 border-b border-purple-500/30 shadow-lg shadow-purple-500/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Gamepad2 className="h-8 w-8 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            GameHub
          </h1>
          <div className="hidden sm:flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">Level {userData?.level}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
            >
              <Home className="h-4 w-4 group-hover:text-purple-300 transition-colors" />
              <span className="font-medium group-hover:text-purple-300 transition-colors">Home</span>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
            >
              <Settings className="h-4 w-4 group-hover:text-purple-300 transition-colors" />
              <span className="font-medium group-hover:text-purple-300 transition-colors">Settings</span>
            </a>
            <a
              href="/dashboard/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
            >
              <User className="h-4 w-4 group-hover:text-purple-300 transition-colors" />
              <span className="font-medium group-hover:text-purple-300 transition-colors">Profile</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-400">Online</span>
            </div>
            <div className="relative">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all duration-200",
                    userButtonPopoverCard: "bg-slate-800 border border-purple-500/30",
                    userButtonPopoverActionButton: "hover:bg-purple-800/50 text-white",
                    userButtonPopoverActionButtonText: "text-white",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{userData?.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu for smaller screens */}
      <div className="md:hidden mt-4 flex justify-center space-x-4">
        <a
          href="/dashboard"
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </a>
        <a
          href="/dashboard/settings"
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </a>
        <a
          href="/dashboard/profile"
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg hover:bg-purple-800/50 transition-all duration-200"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </a>
      </div>
    </nav>
  )
}
