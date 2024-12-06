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
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess"
                disabled={disabled}
            />
            <button type="submit" disabled={disabled}>
                Guess
            </button>
        </form>
    );
};

export default GuessInput;
