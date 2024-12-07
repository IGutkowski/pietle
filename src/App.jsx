import React, { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import GuessInput from "./components/GuessInput";
import Feedback from "./components/Feedback";
import Confetti from "react-confetti";
import "./App.css";

const getDailyPercentage = () => {
    const today = new Date().toISOString().slice(0, 10);
    const seed = parseInt(today.replace(/-/g, ""), 10);
    const rng = Math.sin(seed) * 10000;
    return Math.abs(rng % 100).toFixed(0); // Percentage of cyan slice
};

const App = () => {
    const [correctPercentage, setCorrectPercentage] = useState(getDailyPercentage);
    const [guesses, setGuesses] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [remainingGuesses, setRemainingGuesses] = useState(null); // Start as null
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("gameState"));
        const today = new Date().toISOString().slice(0, 10);

        if (savedState && savedState.date === today) {
            setGuesses(savedState.guesses || []);
            setRemainingGuesses(savedState.remainingGuesses ?? 5); // Use saved value or fallback to 5
        } else {
            setGuesses([]);
            setRemainingGuesses(5);
            localStorage.setItem(
                "gameState",
                JSON.stringify({
                    date: today,
                    guesses: [],
                    remainingGuesses: 5,
                })
            );
        }
    }, []);

    useEffect(() => {
        if (remainingGuesses !== null) {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem(
                "gameState",
                JSON.stringify({
                    date: today,
                    guesses,
                    remainingGuesses,
                })
            );
        }
    }, [guesses, remainingGuesses]);

    const handleGuess = (guess) => {
        const numGuess = parseInt(guess, 10);
        if (isNaN(numGuess) || numGuess < 0 || numGuess > 100) {
            setFeedback("Please enter a number between 0 and 100.");
            return;
        }

        if (numGuess === parseInt(correctPercentage, 10)) {
            setFeedback(`🎉 Correct! The cyan area is ${correctPercentage}%.`);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setGuesses([...guesses, { guess: numGuess, result: "correct" }]);
            setRemainingGuesses(0); // Stop the game when the correct answer is guessed
        } else {
            const updatedGuesses = [
                ...guesses,
                { guess: numGuess, result: numGuess < correctPercentage ? "low" : "high" },
            ];
            setGuesses(updatedGuesses);
            setRemainingGuesses(5 - updatedGuesses.length);

            if (remainingGuesses > 1) {
                setFeedback(
                    `❌ Incorrect! The correct answer is ${
                        numGuess < correctPercentage ? "higher" : "lower"
                    } than ${numGuess}%.`
                );
            } else if (remainingGuesses === 1) {
                setFeedback(
                    `Out of guesses! The correct answer was ${correctPercentage}%. Try again tomorrow.`
                );
            }
        }
    };

    return (
        <div className="App">
            {showConfetti && <Confetti />}
            <header>
                <h1 id="game-title" role="heading" aria-level="1">Piechartle</h1>
                <div className="instructions">
                    <h2>How to Play</h2>
                    <p>
                        Welcome to Piechartle! Your goal is to guess the percentage of the cyan area in the pie chart.
                        You have 5 guesses to get it right. Enter a number between 0 and 100 and submit your guess.
                        Good luck!
                    </p>
                </div>
            </header>

            <PieChart percentage={correctPercentage} />
            <div className="game-area">
                <p>Guesses Remaining: {remainingGuesses}</p>
                <GuessInput onGuess={handleGuess} disabled={remainingGuesses === 0} />
                <div role="alert" aria-live="assertive">
                    {feedback && <Feedback message={feedback} />}
                </div>
            </div>
            <section className="guess-history">
                <h2>Previous Guesses</h2>
                <ul>
                    {guesses.map((g, index) => (
                        <li key={index}>
                            {g.guess}% - {g.result === "correct" ? "🎉 Correct" : g.result}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default App;
