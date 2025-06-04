"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"

// Sample word list - in a real app, you'd have a larger list
const WORDS = [
  "REACT",
  "WORLD",
  "GAMES",
  "PHONE",
  "LIGHT",
  "HOUSE",
  "WATER",
  "PLANT",
  "MUSIC",
  "DANCE",
  "SMILE",
  "HEART",
  "DREAM",
  "PEACE",
  "HAPPY",
  "BRAVE",
  "QUICK",
  "SMART",
  "FRESH",
  "CLEAN",
  "SWEET",
  "MAGIC",
  "POWER",
  "STORY",
]

const WORD_LENGTH = 5
const MAX_ATTEMPTS = 6

type LetterState = "correct" | "present" | "absent" | "empty"

interface Letter {
  char: string
  state: LetterState
}

const WordlePage = () => {
  const [targetWord, setTargetWord] = useState("")
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<Letter[][]>([])
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({})

  // Initialize game
  const initializeGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setTargetWord(randomWord)
    setCurrentGuess("")
    setGuesses([])
    setCurrentAttempt(0)
    setGameStatus("playing")
    setKeyboardState({})
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Check if word is valid (simplified - just check if it's 5 letters)
  const isValidWord = (word: string) => {
    return word.length === WORD_LENGTH && /^[A-Z]+$/.test(word)
  }

  // Evaluate guess and return letter states
  const evaluateGuess = (guess: string): Letter[] => {
    const result: Letter[] = []
    const targetLetters = targetWord.split("")
    const guessLetters = guess.split("")

    // First pass: mark correct positions
    const used = new Array(WORD_LENGTH).fill(false)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { char: guessLetters[i], state: "correct" }
        used[i] = true
      } else {
        result[i] = { char: guessLetters[i], state: "absent" }
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i].state === "absent") {
        for (let j = 0; j < WORD_LENGTH; j++) {
          if (!used[j] && guessLetters[i] === targetLetters[j]) {
            result[i].state = "present"
            used[j] = true
            break
          }
        }
      }
    }

    return result
  }

  // Update keyboard state based on guess
  const updateKeyboardState = (evaluatedGuess: Letter[]) => {
    const newKeyboardState = { ...keyboardState }

    evaluatedGuess.forEach((letter) => {
      const currentState = newKeyboardState[letter.char]

      // Priority: correct > present > absent
      if (!currentState || letter.state === "correct" || (letter.state === "present" && currentState !== "correct")) {
        newKeyboardState[letter.char] = letter.state
      }
    })

    setKeyboardState(newKeyboardState)
  }

  // Submit guess
  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || !isValidWord(currentGuess)) {
      return
    }

    const evaluatedGuess = evaluateGuess(currentGuess)
    const newGuesses = [...guesses, evaluatedGuess]
    setGuesses(newGuesses)
    updateKeyboardState(evaluatedGuess)

    // Check win condition
    if (currentGuess === targetWord) {
      setGameStatus("won")
      return
    }

    // Check lose condition
    if (currentAttempt + 1 >= MAX_ATTEMPTS) {
      setGameStatus("lost")
      return
    }

    setCurrentAttempt(currentAttempt + 1)
    setCurrentGuess("")
  }

  // Handle key input
  const handleKeyInput = (key: string) => {
    if (gameStatus !== "playing") return

    if (key === "ENTER") {
      submitGuess()
    } else if (key === "BACKSPACE") {
      setCurrentGuess(currentGuess.slice(0, -1))
    } else if (key.length === 1 && /^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key)
    }
  }

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        event.preventDefault()
        handleKeyInput(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentGuess, gameStatus, currentAttempt])

  // Get cell style based on letter state
  const getCellStyle = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "bg-green-500 text-white border-green-500"
      case "present":
        return "bg-yellow-500 text-white border-yellow-500"
      case "absent":
        return "bg-gray-500 text-white border-gray-500"
      default:
        return "bg-white border-gray-300"
    }
  }

  // Get keyboard key style
  const getKeyStyle = (letter: string) => {
    const state = keyboardState[letter]
    const baseStyle = "h-12 min-w-[2.5rem] text-sm font-semibold rounded"

    switch (state) {
      case "correct":
        return `${baseStyle} bg-green-500 text-white hover:bg-green-600`
      case "present":
        return `${baseStyle} bg-yellow-500 text-white hover:bg-yellow-600`
      case "absent":
        return `${baseStyle} bg-gray-500 text-white hover:bg-gray-600`
      default:
        return `${baseStyle} bg-gray-200 hover:bg-gray-300`
    }
  }

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wordle</h1>
          <p className="text-gray-600">Guess the 5-letter word in 6 tries</p>
        </div>

        {/* Game Status */}
        {gameStatus !== "playing" && (
          <Card className="p-4 mb-6 text-center">
            {gameStatus === "won" ? (
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 You Won!</h2>
                <p className="text-gray-600">
                  You guessed {targetWord} in {currentAttempt + 1} tries!
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">😔 Game Over</h2>
                <p className="text-gray-600">The word was {targetWord}</p>
              </div>
            )}
            <Button onClick={initializeGame} className="mt-4" variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Card>
        )}

        {/* Game Grid */}
        <div className="grid grid-rows-6 gap-2 mb-8">
          {Array.from({ length: MAX_ATTEMPTS }, (_, attemptIndex) => (
            <div key={attemptIndex} className="grid grid-cols-5 gap-2">
              {Array.from({ length: WORD_LENGTH }, (_, letterIndex) => {
                let letter = ""
                let state: LetterState = "empty"

                if (attemptIndex < guesses.length) {
                  // Past guess
                  letter = guesses[attemptIndex][letterIndex].char
                  state = guesses[attemptIndex][letterIndex].state
                } else if (attemptIndex === currentAttempt) {
                  // Current guess
                  letter = currentGuess[letterIndex] || ""
                  state = "empty"
                }

                return (
                  <div
                    key={letterIndex}
                    className={`
                      w-14 h-14 border-2 flex items-center justify-center
                      text-2xl font-bold transition-all duration-300
                      ${getCellStyle(state)}
                      ${letter && state === "empty" ? "border-gray-500 scale-105" : ""}
                    `}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Virtual Keyboard */}
        <div className="space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className={key === "ENTER" || key === "BACKSPACE" ? `${getKeyStyle(key)} px-3` : getKeyStyle(key)}
                  disabled={gameStatus !== "playing"}
                >
                  {key === "BACKSPACE" ? "⌫" : key}
                </Button>
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <Card className="p-4 mt-8">
          <h3 className="font-semibold mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Guess the 5-letter word in 6 tries</li>
            <li>
              • <span className="inline-block w-4 h-4 bg-green-500 rounded"></span> Green: Correct letter, correct
              position
            </li>
            <li>
              • <span className="inline-block w-4 h-4 bg-yellow-500 rounded"></span> Yellow: Correct letter, wrong
              position
            </li>
            <li>
              • <span className="inline-block w-4 h-4 bg-gray-500 rounded"></span> Gray: Letter not in word
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default WordlePage;