import {Component} from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import "./Landing.css"

class Landing extends Component { 
    constructor() {
        super()
        this.state = {
            /* when user loads up landing page, the gamePage is set to 0 
               so the game is reset to the beginning
            */
            gamePage: 0, 
            houseIndex: [],
        }
    }
    shuffleHouseIndex() {
        this.state.houseIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        let array = this.state.houseIndex
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        this.state.houseIndex = array
      }
      
    render() {
            this.shuffleHouseIndex()
            localStorage.setItem('gamePage', Number(this.state.gamePage))
            localStorage.setItem('houseIndex', this.state.houseIndex)
            console.log(`gamePage: ${window.localStorage.getItem('gamePage')}\nhouseIndex: ${this.state.houseIndex}`);
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
