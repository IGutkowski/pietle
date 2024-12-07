import React from 'react';

const Feedback = ({ message }) => (
    <p role="alert" aria-live="assertive">{message}</p>
);

export default Feedback;
