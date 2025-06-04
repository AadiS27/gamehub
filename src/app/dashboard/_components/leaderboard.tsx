"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Crown, Zap, Star, TrendingUp, Flame, Target, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"

type User = {
  id: string
  name: string
  imageUrl?: string
  score: number
  previousRank?: number
  streak?: number
  level?: number
}

// Particle system for background effects
const Particle = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }}
  />
)

export const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly" | "allTime">("allTime")
  const [hoveredUser, setHoveredUser] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Replace with your actual Convex query
  const users = (useQuery(api.user.getLeaderboard, { timeFrame }) as User[]) || []

  // Animate leaderboard entries on mount and timeframe change
  // Animate leaderboard entries on mount and timeframe change
  useEffect(() => {
    // Animation happens via CSS transitions when timeFrame changes
  }, [timeFrame])
  // Function to get comprehensive styling for positions
  const getPositionStyling = (position: number) => {
    // Rank change is already handled in getRankChangeIndicator
    switch (position) {
      case 0:
        return {
          icon: <Crown className="h-7 w-7 text-yellow-400 drop-shadow-lg animate-pulse" />,
          bgGradient: "bg-gradient-to-r from-yellow-500/30 via-amber-500/25 to-yellow-600/30",
          borderGlow: "ring-2 ring-yellow-400/60 shadow-xl shadow-yellow-400/30",
          textColor: "text-yellow-400",
          titleGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",
          cardScale: "hover:scale-[1.03]",
          particles: true,
        }
      case 1:
        return {
          icon: <Trophy className="h-6 w-6 text-gray-300 drop-shadow-lg" />,
          bgGradient: "bg-gradient-to-r from-gray-400/25 via-slate-400/20 to-gray-500/25",
          borderGlow: "ring-2 ring-gray-400/50 shadow-lg shadow-gray-400/25",
          textColor: "text-gray-300",
          titleGlow: "drop-shadow-[0_0_6px_rgba(156,163,175,0.4)]",
          cardScale: "hover:scale-[1.025]",
          particles: false,
        }
      case 2:
        return {
          icon: <Medal className="h-6 w-6 text-amber-600 drop-shadow-lg" />,
          bgGradient: "bg-gradient-to-r from-amber-600/25 via-orange-500/20 to-amber-700/25",
          borderGlow: "ring-2 ring-amber-600/50 shadow-lg shadow-amber-600/25",
          textColor: "text-amber-600",
          titleGlow: "drop-shadow-[0_0_6px_rgba(217,119,6,0.4)]",
          cardScale: "hover:scale-[1.025]",
          particles: false,
        }
      default:
        return {
          icon: <Star className="h-4 w-4 text-purple-400" />,
          bgGradient: "bg-slate-800/40 hover:bg-slate-800/60",
          borderGlow: "hover:ring-1 hover:ring-purple-500/30",
          textColor: "text-slate-300",
          titleGlow: "",
          cardScale: "hover:scale-[1.01]",
          particles: false,
        }
    }
  }

  // Get rank change indicator
  const getRankChangeIndicator = (user: User, currentPosition: number) => {
    if (!user.previousRank) return null

    const change = user.previousRank - currentPosition
    if (change === 0) return null

    return (
      <div
        className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          change > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
        )}
      >
        {change > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {Math.abs(change)}
      </div>
    )
  }

  // Get user level badge
  const getLevelBadge = (level?: number) => {
    if (!level) return null

    return (
      <div className="flex items-center space-x-1 bg-purple-600/30 px-2 py-1 rounded-full border border-purple-500/40">
        <Target className="h-3 w-3 text-purple-400" />
        <span className="text-xs font-medium text-purple-300">Lv.{level}</span>
      </div>
    )
  }

  // Get streak indicator
  const getStreakIndicator = (streak?: number) => {
    if (!streak || streak < 3) return null

    return (
      <div className="flex items-center space-x-1 bg-orange-600/30 px-2 py-1 rounded-full border border-orange-500/40">
        <Flame className="h-3 w-3 text-orange-400" />
        <span className="text-xs font-medium text-orange-300">{streak}</span>
      </div>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-purple-800/15 rounded-xl blur-2xl animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-transparent rounded-xl"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>

      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/98 via-purple-900/95 to-slate-900/98 border border-purple-500/40 shadow-2xl backdrop-blur-sm">
        {/* Enhanced header with more visual elements */}
        <div className="relative p-6 bg-gradient-to-r from-slate-800/90 via-purple-800/70 to-slate-800/90 border-b border-purple-500/40">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/40 shadow-lg">
                <Zap className="h-7 w-7 text-purple-400" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                  Leaderboard
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-purple-300/90">Elite Champions</p>
                  <div className="flex items-center space-x-1 bg-purple-600/20 px-2 py-1 rounded-full border border-purple-500/30">
                    <TrendingUp className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-purple-300">Live</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {(["daily", "weekly", "allTime"] as const).map((period, index) => (
                <Button
                  key={period}
                  onClick={() => setTimeFrame(period)}
                  size="sm"
                  className={cn(
                    "relative overflow-hidden transition-all duration-500 transform hover:scale-105 font-medium",
                    timeFrame === period
                      ? "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/30 border-purple-400 ring-2 ring-purple-400/50"
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 border-purple-500/40 hover:border-purple-400/60 hover:text-white",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10 capitalize">{period === "allTime" ? "All Time" : period}</span>
                  {timeFrame === period && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-blue-600/60 animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced leaderboard content */}
        <div className="relative">
          {users.length === 0 ? (
            <div className="p-16 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800/80 to-purple-800/60 flex items-center justify-center border border-purple-500/30">
                <Trophy className="h-10 w-10 text-slate-500" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Champions Yet</h3>
              <p className="text-slate-400 mb-1">The throne awaits its first ruler</p>
              <p className="text-sm text-slate-500">Rise up and claim your destiny!</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-500/15">
              {users.map((user, index) => {
                const styling = getPositionStyling(index)
                const isHovered = hoveredUser === user.id

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "relative flex items-center p-5 transition-all duration-500 group cursor-pointer",
                      styling.bgGradient,
                      styling.borderGlow,
                      styling.cardScale,
                      "hover:shadow-2xl",
                      isHovered && "z-10",
                    )}
                    onMouseEnter={() => setHoveredUser(user.id)}
                    onMouseLeave={() => setHoveredUser(null)}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
                    }}
                  >
                    {/* Particle effects for top positions */}
                    {styling.particles && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {Array.from({ length: 8 }, (_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: "2s",
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Enhanced position indicator */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-full transition-all duration-500 group-hover:scale-110",
                        index < 3
                          ? "bg-gradient-to-br from-slate-700/90 to-slate-800/90 border-2 border-purple-500/40 shadow-lg"
                          : "bg-slate-700/60 border border-slate-600/50",
                      )}
                    >
                      {styling.icon}
                      {index >= 3 && <span className="absolute text-sm font-bold text-slate-400">{index + 1}</span>}

                      {/* Glow effect for top 3 */}
                      {index < 3 && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}
                    </div>

                    {/* Enhanced user avatar */}
                    <div className="relative flex-shrink-0 h-14 w-14 ml-4 rounded-full overflow-hidden ring-2 ring-purple-500/40 group-hover:ring-purple-400/60 transition-all duration-500 shadow-lg">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Avatar glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Enhanced user info section */}
                    <div className="ml-5 flex-1 relative">
                      <div className="flex items-center space-x-3 mb-1">
                        <div
                          className={cn(
                            "font-bold text-lg transition-all duration-500",
                            index < 3 ? "text-white" : "text-slate-200",
                            "group-hover:text-white",
                            styling.titleGlow,
                          )}
                        >
                          {user.name}
                        </div>
                        {getRankChangeIndicator(user, index)}
                      </div>

                      <div className="flex items-center space-x-2">
                        {index < 3 && (
                          <div className="text-sm text-purple-300/90 font-medium">
                            {index === 0
                              ? "👑 Reigning Champion"
                              : index === 1
                                ? "🥈 Vice Champion"
                                : "🥉 Bronze Medalist"}
                          </div>
                        )}
                        {getLevelBadge(user.level)}
                        {getStreakIndicator(user.streak)}
                      </div>
                    </div>

                    {/* Enhanced score display */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "px-5 py-3 rounded-xl font-bold text-xl transition-all duration-500 group-hover:scale-105 shadow-lg",
                          index < 3
                            ? "bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-2 border-purple-500/40 shadow-xl"
                            : "bg-slate-800/70 border border-slate-600/50",
                        )}
                      >
                        <div className="flex flex-col items-end">
                          <span className={cn(styling.textColor, "drop-shadow-sm")}>{user.score.toLocaleString()}</span>
                          <span className="text-xs text-purple-400/80 font-medium">points</span>
                        </div>

                        {/* Score glow effect */}
                        {index < 3 && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Enhanced bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
      </Card>

      {/* Additional floating elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full animate-ping"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500/30 rounded-full animate-pulse"></div>
    </div>
  )
}

export default Leaderboard
