"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Bug, CheckCircle, Code, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";


// Utility function to call the Gemini API
const callGeminiApi = async (prompt: string) => {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate content');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};


type Challenge = {
  id: number | string;
  title: string;
  level: "Easy" | "Medium" | "Hard";
  code: string;
  bugDescription: string;
  correctCode: string;
  points: number;
  xp: number;
  language?: string; // Optional field for language (C++, JavaScript, etc.)
};

export default function BugFinderGame() {
  // Keep your existing state variables
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [gameState, setGameState] = useState<"playing" | "correct" | "incorrect" | "complete">("playing");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  
  // Add new state variables for AI-generated challenges
  const [isLoading, setIsLoading] = useState(false);
  
const [aiChallenges, setAiChallenges] = useState<Challenge[]>([]);
  const [usingAiChallenges, setUsingAiChallenges] = useState(false);
  
  const userData = useQuery(api.user.getUser, { userId: "currentUser" });
  const updateUserExp = useMutation(api.user.update);
  
  // Get the current challenge from either predefined or AI-generated list
  const currentChallenge =  aiChallenges[currentChallengeIndex]

  // Generate a new challenge using Gemini
  const generateChallenge = async () => {
    setIsLoading(true);
    
    const prompt = `Generate a C++ code challenge with a bug for a game. Format as JSON with these fields:
- title: A short descriptive title (5-8 words)
- level: "Easy", "Medium", or "Hard"
- code: A C++ function with exactly one bug (10-15 lines max)
- bugDescription: A precise description of what's wrong with the code (10-15 words, complete sentence)
- correctCode: The fixed version of the code
- points: Numerical point value (Easy: 10-15, Medium: 15-25, Hard: 25-40)
- xp: Experience points (20-50)

Requirements:
1. The bug should be clearly identifiable and have exactly one correct answer
2. The bugDescription should be specific and unambiguous
3. The correctCode must fix ONLY the bug, with minimal changes
4. The challenge should compile after fixing the bug
5. Focus on logical errors rather than syntax errors
6. Include some fundamental DSA concepts like arrays, recursion, sorting, or data structures

Common bug types:
- Off-by-one errors in loops or array access
- Logic errors in conditionals
- Incorrect pointer usage
- Memory leaks
- Incorrect operator precedence
- Improper initialization
- Array traversal bugs (accessing out of bounds)
- Missing base cases in recursive functions
- Incorrect sorting algorithm implementation
- Linked list pointer mishandling
- Stack overflow due to infinite recursion
- Binary search implementation errors
- Tree traversal bugs
- Queue implementation issues

Output only valid JSON with these fields, no explanation or extra text.
Wrap the JSON in triple backticks to ensure it's properly formatted.`;

    const response = await callGeminiApi(prompt);
    
    if (response) {
      try {
        // Extract JSON from the response if it's wrapped in backticks
        let jsonStr = response;
        
        // Try to extract JSON if it's wrapped in backticks
        const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1].trim();
        }
        
        console.log("Attempting to parse:", jsonStr);
        
        const challenge = JSON.parse(jsonStr);
        
        // Validate the challenge has all required fields
        if (!challenge.title || !challenge.code || !challenge.bugDescription || 
            !challenge.correctCode || !challenge.points || !challenge.xp) {
          throw new Error("Generated challenge is missing required fields");
        }
        
        // Add an ID to the challenge
        challenge.id = Date.now();
        
        setAiChallenges([...aiChallenges, challenge]);
        setIsLoading(false);
        return challenge;
      } catch (error) {
        console.error("Failed to parse generated challenge:", error);
        console.log("Raw response:", response);
        setIsLoading(false);
        return null;
      }
    } else {
      setIsLoading(false);
      return null;
    }
  };
  
  // Start game with AI-generated challenges
  const startGameWithAI = async () => {
    setIsLoading(true);
    const challenges = [];
    
    // Generate 3 challenges
    for (let i = 0; i < 3; i++) {
      const challenge = await generateChallenge();
      if (challenge) {
        challenges.push(challenge);
      }
    }
    
    if (challenges.length > 0) {
      setAiChallenges(challenges);
      setUsingAiChallenges(true);
      setGameStarted(true);
      setIsTimerRunning(true);
      setScore(0);
      setCurrentChallengeIndex(0);
      setGameState("playing");
      setHintUsed(false);
      setUserAnswer("");
      setTimer(60);
    } else {
      toast.error("Failed to generate challenges. Using predefined ones instead.");
      startGame();
    }
    
    setIsLoading(false);
  };
  
  // Start game with predefined challenges
  const startGame = () => {
    setUsingAiChallenges(false);
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
  
  // Check answer without AI
  const checkAnswer = () => {
    // Make answer checking more lenient by checking if key parts of the description are included
    const userAnswerLower = userAnswer.trim().toLowerCase();
    const correctAnswerLower = currentChallenge.bugDescription.trim().toLowerCase();
    
    // Extract keywords from the correct answer
    const keywords = correctAnswerLower
      .replace(/[.,;:()]/g, '') // Remove punctuation
      .split(' ')
      .filter(word => word.length > 3); // Filter out short words
    
    // Check if enough keywords are present in the user's answer
    const matchedKeywords = keywords.filter(keyword => userAnswerLower.includes(keyword));
    const keywordMatchRatio = matchedKeywords.length / keywords.length;
    
    // Consider correct if at least 60% of keywords are present
    const isCorrect = keywordMatchRatio >= 0.6;
    
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
      
      // Update user XP in database
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
    if (currentChallengeIndex < aiChallenges.length - 1) {
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
  
  // Check answer using Gemini
  const checkAnswerWithAI = async () => {
    if (!userAnswer.trim()) return;
    
    setIsLoading(true);
    
    const prompt = `You are evaluating a student's answer to a coding bug identification question.

Code with bug:
\`\`\`cpp
${currentChallenge.code}
\`\`\`

Correct description of the bug: "${currentChallenge.bugDescription}"

Student's answer: "${userAnswer.trim()}"

Is the student's answer correct? You should be somewhat lenient - if they identified the main issue even in different words, consider it correct.
The answer should be considered correct if:
- They identified the main problem even if using different terminology
- They described the bug's impact correctly
- They pointed to the right location in the code

Return ONLY the word "CORRECT" or "INCORRECT" followed by a very brief explanation of why.`;

    const response = await callGeminiApi(prompt);
    
    if (response) {
      // More lenient check for response containing "CORRECT"
      const isCorrect = response.toUpperCase().includes("CORRECT") && 
                       !response.toUpperCase().startsWith("INCORRECT");
      handleAnswerResult(isCorrect);
    } else {
      // Fallback to keyword matching if API fails
      const userAnswerLower = userAnswer.trim().toLowerCase();
      const correctAnswerLower = currentChallenge.bugDescription.trim().toLowerCase();
      
      const keywords = correctAnswerLower
        .replace(/[.,;:()]/g, '')
        .split(' ')
        .filter(word => word.length > 3);
      
      const matchedKeywords = keywords.filter(keyword => userAnswerLower.includes(keyword));
      const keywordMatchRatio = matchedKeywords.length / keywords.length;
      
      const isCorrect = keywordMatchRatio >= 0.6;
      handleAnswerResult(isCorrect);
    }
    
    setIsLoading(false);
  };
  
  // Handle the result of the answer check
  const handleAnswerResult = (isCorrect: boolean) => {
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
      
      // Update user XP in database
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
      }
    } else {
      setGameState("incorrect");
    }
  };

  // Update your return JSX to include the AI option
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
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            
              <Button 
                onClick={startGameWithAI} 
                disabled={isLoading}
                className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating Challenges...
                  </div>
                ) : (
                  "Start AI Challenge"
                )}
              </Button>
            </div>
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
                  <div className="text-3xl font-bold text-white">{currentChallengeIndex} / {aiChallenges.length}</div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startGameWithAI} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Play Again
            </Button>
            <Button 
              onClick={() => window.location.href = "/dashboard"} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Go  to Dashboard
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
                        onClick={usingAiChallenges ? checkAnswerWithAI : checkAnswer}
                        disabled={!userAnswer.trim() || isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Checking...
                          </div>
                        ) : (
                          "Submit Answer"
                        )}
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
        
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center max-w-md">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-white text-lg font-medium">
                {usingAiChallenges ? "AI is thinking..." : "Loading..."}
              </p>
              <p className="text-purple-300 text-center mt-2">
                {usingAiChallenges ? "Generating a unique coding challenge for you." : "Please wait..."}
              </p>
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