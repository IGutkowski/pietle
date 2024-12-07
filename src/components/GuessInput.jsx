import React, { useState } from 'react';

const GuessInput = ({ onGuess, disabled }) => {
    const [guess, setGuess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (disabled) return;
        onGuess(guess);
        setGuess('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="guess-input" className="sr-only">Enter your guess</label>
            <input
                id="guess-input"
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess"
                disabled={disabled}
                aria-describedby="guess-help"
            />
            <button type="submit" disabled={disabled} aria-label="Submit guess">
                Guess
            </button>
            <span id="guess-help" className="sr-only">Enter a number between 0 and 100 to guess the percentage of the cyan area.</span>
        </form>
    );
};


export default GuessInput;
