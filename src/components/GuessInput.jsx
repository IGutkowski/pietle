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
        </form>
    );
};


export default GuessInput;
