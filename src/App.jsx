import React, { useState, useEffect } from "react";
import PieChart from "./components/PieChart";
import GuessInput from "./components/GuessInput";
import Feedback from "./components/Feedback";
import Confetti from "react-confetti";
import { Helmet } from "react-helmet";
import "./App.css";

const getDailyPercentage = () => {
    const todayUTC = new Date().toISOString().slice(0, 10);
    const seed = parseInt(todayUTC.replace(/-/g, ""), 10);
    const rng = Math.sin(seed) * 10000;
    return Math.abs(rng % 100).toFixed(0);
};

const getNextMidnightUTC = () => {
    const now = new Date();
    return new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + 1,
            0,
            0,
            0
        )
    );
};

const calculateTimeLeft = () => {
    const now = new Date();
    const timeUntilNext = getNextMidnightUTC() - now;

    const hours = Math.floor((timeUntilNext / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((timeUntilNext / (1000 * 60)) % 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor((timeUntilNext / 1000) % 60)
        .toString()
        .padStart(2, "0");

    return { hours, minutes, seconds };
};

const App = () => {
    const [correctPercentage, setCorrectPercentage] = useState(getDailyPercentage);
    const [guesses, setGuesses] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [remainingGuesses, setRemainingGuesses] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("gameState"));
        const todayUTC = new Date().toISOString().slice(0, 10);

        if (savedState && savedState.date === todayUTC) {
            setGuesses(savedState.guesses || []);
            setRemainingGuesses(savedState.remainingGuesses ?? 5);
        } else {
            setGuesses([]);
            setRemainingGuesses(5);
            localStorage.setItem(
                "gameState",
                JSON.stringify({
                    date: todayUTC,
                    guesses: [],
                    remainingGuesses: 5,
                })
            );
        }
    }, []);

    useEffect(() => {
        if (remainingGuesses !== null) {
            const todayUTC = new Date().toISOString().slice(0, 10);
            localStorage.setItem(
                "gameState",
                JSON.stringify({
                    date: todayUTC,
                    guesses,
                    remainingGuesses,
                })
            );
        }
    }, [guesses, remainingGuesses]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
            setRemainingGuesses(0);
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
        <>
            <Helmet>
                <title>Piechartle - Guess the Cyan Pie Chart Percentage</title>
                <meta
                    name="description"
                    content="Play Piechartle, a Wordle-inspired pie chart guessing game! Guess the cyan area's percentage and test your puzzle-solving skills."
                />
                <meta property="og:title" content="Piechartle - Cyan Pie Chart Guessing Game" />
                <meta
                    property="og:description"
                    content="A Wordle-inspired game where you guess the cyan pie chart percentage. Fun and challenging!"
                />
                <meta property="og:image" content="https://www.piechartle.com/piechart.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Piechartle - The Best Pie Chart Wordle Game" />
                <meta
                    name="twitter:description"
                    content="Try Piechartle, the fun Wordle-inspired pie chart puzzle game! Guess the cyan area percentage today!"
                />
            </Helmet>

            <div className="App">
                {showConfetti && <Confetti />}
                <header>
                    <h1 id="game-title" role="heading" aria-level="1">
                        Piechartle
                    </h1>
                    <div className="instructions">
                        <h2>How to Play</h2>
                        <p>
                            Welcome to Piechartle! Your goal is to guess the percentage of the cyan area in the pie chart.
                            You have 5 guesses to get it right. Enter a number between 0 and 100 and submit your guess.
                            Good luck!
                        </p>
                    </div>
                </header>
                {remainingGuesses === 0 && (
                    <div className="timer" role="timer" aria-live="polite">
                        <h2>Time Until Next Challenge</h2>
                        <div className="timer-display" aria-label={`Time remaining: ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}>
                            <span aria-hidden="true">{timeLeft.hours}</span>
                            <span className="timer-separator" aria-hidden="true">:</span>
                            <span aria-hidden="true">{timeLeft.minutes}</span>
                            <span className="timer-separator" aria-hidden="true">:</span>
                            <span aria-hidden="true">{timeLeft.seconds}</span>
                        </div>
                    </div>
                )}
                <PieChart percentage={correctPercentage} />
                <main className="game-area">
                    <p>Guesses Remaining: {remainingGuesses}</p>
                    <GuessInput onGuess={handleGuess} disabled={remainingGuesses === 0} />
                    <div role="alert" aria-live="assertive">
                        {feedback && <Feedback message={feedback} />}
                    </div>
                </main>
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
                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Igor Gutkowski</p>
                    <p>Contact: <a href="mailto:igor0gutkowski@gmail.com">igor0gutkowski@gmail.com</a></p>
                </footer>
            </div>
        </>
    );
};

export default App;
