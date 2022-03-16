import { Link } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import NavBar from './navbar'
// import "./Landing.css"

// > populates a list (len = 10) with different random numbers under 80 
// > this serves as a way for the game to access random indexes in house data json 
function randomizeHouseIndexes() {
    const randomHouseIndexes = []
    const max = 80

    for(let i=0;i<10;i++){
        let ranNum = Math.floor(Math.random() * max)
        while(randomHouseIndexes.includes(ranNum)){
            ranNum = Math.floor(Math.random() * max)
        }
        randomHouseIndexes.push(ranNum)
    }
    console.log(`randomHouseIndexes: ${randomHouseIndexes}`)
    window.localStorage.setItem('randomHouseIndexes', randomHouseIndexes)
}

function setData() {
    localStorage.clear()
    localStorage.setItem('gamePage', 0)
    randomizeHouseIndexes()
    localStorage.setItem('totalDiff', 0)
    localStorage.setItem('smallestDiff', 0)
}

function Landing() {   
    setData()
    return (
            <div className="landing">
                <NavBar />
                <h1>EstateGuesser</h1>
                <h2>Can you guess the price of a <strong>random house?</strong></h2>
                <Button variant="contained"><Link to="/game" style={{ color: "white" }}> PLAY </Link></Button>
            </div>
    )
}
export default Landing
