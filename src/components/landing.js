import {useContext} from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { GameContext } from "../App";
// import "./Landing.css"

function Landing() { 
    const gameContext = useContext(GameContext)
    // console.log(gameContext[0])
    // gameContext[1](4)
    // console.log(gameContext[0])
    // console.log(gameContext[2])
    // gameContext[3]([0,1])

    // function shuffleHouseIndex() {
    //     this.state.houseIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    //     let array = this.state.houseIndex
    //     let currentIndex = array.length,  randomIndex;
      
    //     // While there remain elements to shuffle...
    //     while (currentIndex != 0) {
      
    //       // Pick a remaining element...
    //       randomIndex = Math.floor(Math.random() * currentIndex);
    //       currentIndex--;
      
    //       // And swap it with the current element.
    //       [array[currentIndex], array[randomIndex]] = [
    //         array[randomIndex], array[currentIndex]];
    //     }
      
    //     this.state.houseIndex = array
    // }
    
    return (
            <div className="landing">
                <h1>EstateGuesser</h1>
                <h2>Can you guess the price of a <strong>random house?</strong></h2>
                <Button variant="primary"><Link to="/game" style={{ color: "white" }}> PLAY </Link></Button>
            </div>
    )
}
export default Landing
