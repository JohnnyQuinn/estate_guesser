import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import "./Landing.css"

// populates a list (len = 10) with different random numbers under 80 
// this serves as a way for the game to access the house data json randomly
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

function Landing() {   
    window.localStorage.clear()
    window.localStorage.setItem('gamePage', 0)
    randomizeHouseIndexes()
    return (
            <div className="landing">
                <h1>EstateGuesser</h1>
                <h2>Can you guess the price of a <strong>random house?</strong></h2>
                <Button variant="primary"><Link to="/game" style={{ color: "white" }}> PLAY </Link></Button>
            </div>
    )
}
export default Landing
