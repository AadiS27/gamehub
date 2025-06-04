
import { Gamepad2, Trophy, Users, Zap, Star, Play,  ArrowRight } from "lucide-react"
import Link from "next/link"
import Leaderboard from "./_components/leaderboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
   

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Gamepad2 className="h-20 w-20 text-purple-400 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Welcome to GameHub
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate gaming platform where legends are born. Join millions of players, compete in tournaments, and
              level up your gaming experience!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Start Gaming</span>
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-300 font-bold rounded-lg hover:bg-purple-500/20 transition-all duration-200 flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>View Tournaments</span>
              </button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-lg border border-green-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="h-6 w-6 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">1.2M+</span>
                </div>
                <p className="text-gray-300 text-sm">Active Players</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">50K+</span>
                </div>
                <p className="text-gray-300 text-sm">Tournaments</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-6 w-6 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">24/7</span>
                </div>
                <p className="text-gray-300 text-sm">Gaming Action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Games</h2>
            <p className="text-gray-300 text-lg">Discover the most popular games in our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Wordle", players: "250K", rating: 4.9, category: "Brain",url:"/wordle" },
              { name: "Mystic Realms", players: "180K", rating: 4.8, category: "RPG" },
              { name: "Speed Racers", players: "120K", rating: 4.7, category: "Racing" },
            ].map((game, index) => (
              <Link href={game.url || "#"} key={index}>
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 transform hover:scale-105 group"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg mb-4 flex items-center justify-center">
                  <Gamepad2 className="h-12 w-12 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-purple-300 text-sm mb-3">{game.category}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300 text-sm">{game.rating}</span>
                  
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{game.players}</span>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Top Players</h2>
            <p className="text-gray-300 text-lg">See whos dominating the leaderboards</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {[
              { rank: 1, name: "ShadowGamer", score: "125,430", level: 89, icon: Crown },
              { rank: 2, name: "NeonNinja", score: "118,250", level: 85, icon: Sword },
              { rank: 3, name: "CyberQueen", score: "112,890", level: 82, icon: Shield },
            ].map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 mb-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-yellow-500/20 border border-yellow-500/50"
                        : index === 1
                          ? "bg-gray-400/20 border border-gray-400/50"
                          : "bg-orange-500/20 border border-orange-500/50"
                    }`}
                  >
                    <player.icon
                      className={`h-5 w-5 ${
                        index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-orange-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{player.name}</h3>
                    <p className="text-gray-400 text-sm">Level {player.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-300 font-bold">{player.score}</p>
                  <p className="text-gray-400 text-sm">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <Leaderboard/>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Level Up?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join the ultimate gaming community and start your journey to becoming a legend. Compete, win, and claim your
            place among the elite!
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2 mx-auto">
            <span>Join GameHub Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

   
    </div>
  )
}
