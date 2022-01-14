import React from "react";
import { Link } from 'react-router-dom';
// import "./Landing.css"


function Landing() {
    return (
        <div className="landing">
            <h1>EstateGuesser</h1>
            <h2>Can you guess the price of a <strong>random house?</strong></h2>
            <button><Link to="/game"> Play </Link></button>
        </div>
    )
}

export default Landing
