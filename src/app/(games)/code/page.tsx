"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Bug, CheckCircle, Code, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const bugChallenges = [
  {
    id: 1,
    title: "Missing Semicolon",
    level: "Easy",
    code: `function calculateTotal(items) {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].price
  }
  return total
}`,
    bugDescription: "Missing semicolons at the end of statements",
    correctCode: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
    points: 10,
    xp: 15,
  },
  {
    id: 2,
    title: "Array Index Out of Bounds",
    level: "Medium",
    code: `function getLastElement(array) {
  return array[array.length];
}`,
    bugDescription: "The array index is out of bounds",
    correctCode: `function getLastElement(array) {
  return array[array.length - 1];
}`,
    points: 20,
    xp: 25,
  },
  {
    id: 3,
    title: "Incorrect Comparison",
    level: "Easy",
    code: `function checkEqual(a, b) {
  if (a = b) {
    return true;
  }
  return false;
}`,
    bugDescription: "Using assignment instead of comparison",
    correctCode: `function checkEqual(a, b) {
  if (a === b) {
    return true;
  }
  return false;
}`,
    points: 15,
    xp: 20,
  },
  {
    id: 4,
    title: "Infinite Loop",
    level: "Hard",
    code: `function countDown(n) {
  let result = [];
  while (n >= 0) {
    result.push(n);
    n++;
  }
  return result;
}`,
    bugDescription: "The loop will never terminate",
    correctCode: `function countDown(n) {
  let result = [];
  while (n >= 0) {
    result.push(n);
    n--;
  }
  return result;
}`,
    points: 30,
    xp: 40,
  },
  {
    id: 5,
    title: "Scope Issue",
    level: "Medium",
    code: `function createCounter() {
  let count = 0;
  
  function increment() {
    count++;
  }
  
  return {
    increment: increment,
    getCount: function() {
      return Count;
    }
  };
}`,
    bugDescription: "Incorrect variable capitalization causing reference error",
    correctCode: `function createCounter() {
  let count = 0;
  
  function increment() {
    count++;
  }
  
  return {
    increment: increment,
    getCount: function() {
      return count;
    }
  };
}`,
    points: 25,
    xp: 30,
  },
];

export default function BugFinderGame() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [gameState, setGameState] = useState<"playing" | "correct" | "incorrect" | "complete">("playing");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  
  const userData = useQuery(api.user.getUser, { userId: "currentUser" });
  const updateUserExp = useMutation(api.user.update);
  
  const currentChallenge = bugChallenges[currentChallengeIndex];
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
    setScore(0);
    setCurrentChallengeIndex(0);
    setGameState("playing");
    setHintUsed(false);
    setUserAnswer("");
    setTimer(60);
  };
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setGameState("complete");
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);
  
  // Check answer
  // Check answer
const checkAnswer = () => {
  const isCorrect = userAnswer.trim() === currentChallenge.bugDescription.trim();
  
  if (isCorrect) {
    // Calculate points (less if hint was used)
    const pointsEarned = hintUsed ? Math.floor(currentChallenge.points / 2) : currentChallenge.points;
    const xpEarned = hintUsed ? Math.floor(currentChallenge.xp / 2) : currentChallenge.xp;
    
    setScore(prevScore => prevScore + pointsEarned);
    setGameState("correct");
    
    // Trigger confetti effect for correct answer
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Update user XP in database - FIX HERE
    if (userData && userData.id !== "not_found") {
      // Calculate new experience and check for level up
      const newExp = userData.exp + xpEarned;
      let newLevel = userData.level;
      
      // Simple level up logic: level up when exp crosses level*100 threshold
      const expThreshold = userData.level * 100;
      if (newExp >= expThreshold) {
        newLevel = userData.level + 1;
        // Show level up notification
        toast.success(`🎉 LEVEL UP! You reached level ${newLevel}!`, {
          position: "top-center",
          duration: 5000,
        });
        
        // Extra confetti for level up
        confetti({
          particleCount: 200,
          spread: 180,
          origin: { y: 0.5, x: 0.5 }
        });
      }
      
      // Update the user data in Convex
      updateUserExp({
        name: userData.name,
        exp: newExp,
        level: newLevel,
        avatar: userData.avatar
      }).catch(err => console.error("Failed to update XP:", err));
      
      toast.success(`+${xpEarned} XP earned!`, {
        position: "top-right",
        duration: 3000,
      });
    } else if (userData && userData.id === "not_found") {
      // Handle the case where user exists in auth but not in database
      toast.error("Please refresh the page to sync your profile before earning XP", {
        position: "top-center",
        duration: 5000,
      });
    }
  } else {
    setGameState("incorrect");
  }
};
  // Move to next challenge
  const nextChallenge = () => {
    if (currentChallengeIndex < bugChallenges.length - 1) {
      setCurrentChallengeIndex(prevIndex => prevIndex + 1);
      setUserAnswer("");
      setGameState("playing");
      setHintUsed(false);
    } else {
      // Game complete
      setGameState("complete");
      setIsTimerRunning(false);
    }
  };
  
  // Show hint
  const showHint = () => {
    setHintUsed(true);
    toast.info("The bug is highlighted in red. Points will be reduced.", {
      position: "top-center",
      duration: 3000,
    });
  };
  
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Highlight bug in code if hint is used
  const getHighlightedCode = () => {
    if (!hintUsed) return currentChallenge.code;
    
    const originalCode = currentChallenge.code;
    const correctCode = currentChallenge.correctCode;
    
    // Find difference between original and correct code
    const lines1 = originalCode.split('\n');
    const lines2 = correctCode.split('\n');
    
    let result = '';
    
    for (let i = 0; i < lines1.length; i++) {
      if (i < lines2.length && lines1[i] !== lines2[i]) {
        result += `<span class="bg-red-500/20 text-red-300">${lines1[i]}</span>\n`;
      } else {
        result += `${lines1[i]}\n`;
      }
    }
    
    return result;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/30">
              <Bug className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Bug Finder
              </h1>
              <p className="text-purple-300">Find the bugs in the code and fix them</p>
            </div>
          </div>
          
          {gameStarted && (
            <div className="flex items-center space-x-4">
              <div className="bg-slate-800/70 px-4 py-2 rounded-lg border border-purple-500/30">
                <div className="text-sm text-purple-300">Time</div>
                <div className="text-xl font-bold text-white">{formatTime(timer)}</div>
              </div>
              
              <div className="bg-slate-800/70 px-4 py-2 rounded-lg border border-purple-500/30">
                <div className="text-sm text-purple-300">Score</div>
                <div className="text-xl font-bold text-white">{score}</div>
              </div>
            </div>
          )}
        </div>
        
        {!gameStarted ? (
          <Card className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-xl text-center">
            <div className="mb-6">
              <Code className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Bug Finder Challenge</h2>
              <p className="text-purple-300 max-w-lg mx-auto">
                Find bugs in code snippets before time runs out. Identify what's wrong with each snippet to earn points and XP.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-bold text-white">Earn XP</h3>
                <p className="text-sm text-purple-300">Boost your level with each correct answer</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="font-bold text-white">Find Bugs</h3>
                <p className="text-sm text-purple-300">Spot common coding mistakes</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-bold text-white">Beat the Clock</h3>
                <p className="text-sm text-purple-300">Complete as many as you can in 60 seconds</p>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Start Challenge
            </Button>
          </Card>
        ) : gameState === "complete" ? (
          <Card className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-xl text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h2>
              <p className="text-purple-300">You've completed the bug finder challenge.</p>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/30 mb-8 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-purple-300">Final Score</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
                <div>
                  <div className="text-sm text-purple-300">Challenges</div>
                  <div className="text-3xl font-bold text-white">{currentChallengeIndex} / {bugChallenges.length}</div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Play Again
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-xl overflow-hidden">
                <div className="p-4 bg-slate-800/50 border-b border-purple-500/30 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">Challenge {currentChallengeIndex + 1}: {currentChallenge.title}</h3>
                    <div className="text-xs text-purple-300 mt-1">
                      Difficulty: <span className={`
                        ${currentChallenge.level === "Easy" ? "text-green-400" : ""}
                        ${currentChallenge.level === "Medium" ? "text-yellow-400" : ""}
                        ${currentChallenge.level === "Hard" ? "text-red-400" : ""}
                      `}>{currentChallenge.level}</span>
                    </div>
                  </div>
                  <div className="text-sm bg-purple-600/20 px-3 py-1 rounded-full text-purple-300 border border-purple-500/30">
                    {currentChallenge.points} points
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 font-mono text-sm overflow-auto mb-6">
                    <pre
                      className="text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: getHighlightedCode()
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      What's the bug in this code?
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={gameState !== "playing"}
                      placeholder="Describe what's wrong with the code..."
                      className="w-full bg-slate-800/50 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t border-purple-500/30 flex justify-between">
                  {gameState === "playing" && (
                    <>
                      <Button
                        onClick={showHint}
                        disabled={hintUsed}
                        variant="outline"
                        className="bg-slate-800/50 text-purple-300 border-purple-500/30 hover:bg-slate-700"
                      >
                        Show Hint {hintUsed && "(Used)"}
                      </Button>
                      
                      <Button
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Submit Answer
                      </Button>
                    </>
                  )}
                  
                  {gameState === "correct" && (
                    <>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Correct! {hintUsed ? "Half points awarded (hint used)." : ""}
                      </div>
                      
                      <Button
                        onClick={nextChallenge}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Next Challenge
                      </Button>
                    </>
                  )}
                  
                  {gameState === "incorrect" && (
                    <>
                      <div className="flex items-center text-red-400">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Not quite right. Try again.
                      </div>
                      
                      <Button
                        onClick={() => setGameState("playing")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Try Again
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
            
            <div>
              <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-xl h-full">
                <div className="p-4 bg-slate-800/50 border-b border-purple-500/30">
                  <h3 className="font-bold text-white">Correct Solution</h3>
                </div>
                
                {gameState === "correct" ? (
                  <div className="p-6">
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 font-mono text-sm overflow-auto mb-4">
                      <pre className="text-green-300">{currentChallenge.correctCode}</pre>
                    </div>
                    
                    <div className="text-sm text-purple-300">
                      <p><span className="font-bold text-white">Bug: </span>{currentChallenge.bugDescription}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <Code className="h-12 w-12 text-purple-400 mb-4 opacity-50" />
                    <p className="text-purple-300">
                      Submit your answer to see the correct solution
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Trophy(props: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}