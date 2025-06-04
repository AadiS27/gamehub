import { UserButton } from "@clerk/nextjs"
import {
  Gamepad2,
  Home,
  Settings,
  User,
  Zap,
  Heart,
  Github,
  Twitter,
  DiscIcon as Discord,
  Trophy,
  Users,
  Clock,
} from "lucide-react"

export const Navbar = () => {
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
            <span className="text-xs font-semibold text-yellow-400">LVL 42</span>
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
                <span className="text-xs font-bold text-white">42</span>
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

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border-t border-purple-500/30 shadow-lg shadow-purple-500/20">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GameHub
              </h3>
            </div>
            <p className="text-sm text-gray-300 text-center md:text-left max-w-xs">
              The ultimate gaming platform for players worldwide. Level up your gaming experience!
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-lg font-semibold text-purple-300">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <a
                href="/dashboard"
                className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Dashboard
              </a>
              <a
                href="/games"
                className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Browse Games
              </a>
              <a
                href="/leaderboard"
                className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Leaderboard
              </a>
              <a
                href="/tournaments"
                className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Tournaments
              </a>
            </div>
          </div>

          {/* Gaming Stats */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-lg font-semibold text-purple-300">Community Stats</h4>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="h-4 w-4 text-green-400" />
                <span>1.2M+ Active Players</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>50K+ Tournaments</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>24/7 Gaming Action</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-lg font-semibold text-purple-300">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-purple-800/30 hover:bg-purple-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
              >
                <Discord className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-purple-800/30 hover:bg-purple-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
              >
                <Twitter className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-purple-800/30 hover:bg-purple-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 group"
              >
                <Github className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
              </a>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-lg border border-purple-500/30">
              <p className="text-xs text-center text-gray-300">
                Join our Discord for exclusive tournaments and rewards!
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} GameHub. All rights reserved.</p>
              <p className="text-xs mt-1 text-gray-400">Powering the future of gaming since 2024</p>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Aadi
              </span>
            </div>

            {/* Gaming Badge */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">Powered by Gamers</span>
            </div>
          </div>
        </div>

        {/* Bottom Gaming Elements */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>🎮 Game On!</span>
            <span>•</span>
            <span>⚡ Level Up Daily</span>
            <span>•</span>
            <span>🏆 Compete & Win</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
