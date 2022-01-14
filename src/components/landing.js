import React from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import "./Landing.css"


class Landing extends React.Component { 
    constructor() {
        super()
        this.state = {
            /* when user loads up landing page, the gamePage is set to 0 
               so the game is reset to the beginning
            */
            gamePage: 0, 
        }
    }
    render() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('gamePage', Number(this.state.gamePage))
            console.log(`gamePage: ${window.localStorage.getItem('gamePage')}`);
        }
        return (
            <div className="landing">
                <h1>EstateGuesser</h1>
                <h2>Can you guess the price of a <strong>random house?</strong></h2>
                <Button variant="primary"><Link to="/game" style={{ color: "white" }}> PLAY </Link></Button>
            </div>
        )
    }
}
export default Landing
