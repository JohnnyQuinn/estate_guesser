import React, { useState } from 'react';
// import { Card, Container, Row, Col, Carousel, Form, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import HomeData from "../home-data/home-data.json"
import CurrencyInput from 'react-currency-input-field';
import Navbar from './navbar'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { InputAdornment } from '@mui/material';
import Carousel from 'react-material-ui-carousel'


function Game() {
    const navigate = useNavigate()
    const [guessInput, setGuessInput] = useState('')
    const [showGuess, setShowGuess] = useState(true)
    const [showResult, setShowResult] = useState(false)
    const [guessFinal, setGuessFinal] = useState(0)

    let gamePage = Number(localStorage.getItem('gamePage'))
    let randomHouseIndexes = localStorage.getItem('randomHouseIndexes')
    let totalDiff = Number(localStorage.getItem('totalDiff'))
    let smallestDiff = Number(localStorage.getItem('smallestDiff'))

    // HomeData
    let price = 0
    let homePics = []
    let location = ''
    let bed = ''
    let bath = ''
    let sq = ''

    // formats numbers to USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })
    // set first img to same size as others
    const cardImgStyle = {
        width: '576px', 
        height: '432px'
    }

    // since localStorage only stores strings the data from localStorage needs to be converted from 
    // string to an array
    function formatHouseIndex() { 
        let strArr = randomHouseIndexes
        strArr = strArr.split(',')
        let numArr = []
        for(let i=0;i<strArr.length;i++){
            numArr.push(Number(strArr[i]))
        }
        randomHouseIndexes = numArr
        console.log(numArr)
    }

    // sets all the house data objects to the appropriate values from house-data.json
    function setCurrData() {
        //gets random number from randomHouseIndexes based on the current gamePage to use for the index when accessing the house data from house-data.json
        const index = randomHouseIndexes[gamePage]
        console.log(`index: ${index}`)
        price = Number(HomeData[index]["price"]);
        homePics = HomeData[index]["homePics"]
        location = HomeData[index]['location']
        bed = HomeData[index]['bed']
        bath = HomeData[index]['bath']
        sq = HomeData[index]['sq']
    }

    // compares user's guess with actual price and displays the result
    function handleSubmit() {
        // sets the value of guessFinal and formats it from a string (with commas) to a number 
        setGuessFinal(Number(((guessInput).slice(1)).replace(/,/g, '')))
        // calculates the absolute difference of the actual price with the user's guess
        let guessDiff = Math.abs(price - guessFinal)
        // adds the difference to the totalDiff
        localStorage.setItem('totalDiff', totalDiff + guessDiff)

        //if this is the first page of the game then set the value of the smallestDiff
        // if not then check to see if the smallestDiff is greater than the more recent guess and if so, set the value of the 
        // smallestDiff = guessDiff
        if(gamePage == 0){
            localStorage.setItem('smallestDiff', guessDiff)
        } else if(smallestDiff > guessDiff){
            localStorage.setItem('smallestDiff', guessDiff)
        }

        setShowResult(true)
        setShowGuess(false)
    }

    // > handles when the NEXT button is press and will redirect to the game-over component if the user finishes guessing 10 houses
    // > NEXT button is type="submit" so it reloads the page (and when the page reloads it will be different because the gamePage value is changed)
    function handleNext() {
        gamePage += 1 
        if(gamePage > 9){
            navigate('/game-over')
        } else {
            localStorage.setItem('gamePage', gamePage)
        }
    }
  
    formatHouseIndex()
    setCurrData()
    console.log(`gamePage: ${gamePage}, typeof: ${typeof(gamePage)}`)
    console.log(`randomHouseIndexes: ${randomHouseIndexes}, typeof: ${typeof(randomHouseIndexes)}`) 
    return (
        <div className="game">
            <Navbar />
            <Container fluid>
                <Grid container direction="row">
                    <Grid item></Grid>
                    <Grid item xs={10}>
                        <Card>
                            <CardContent>
                                <Grid container direction="row">
                                    <Grid> {/*insert carousel here */}</Grid>
                                    <Grid>
                                        <Typography variant="h4">Location: {location}</Typography>
                                        <Typography variant="h4">Bed(s): {bed}</Typography>
                                        <Typography variant="h4">Bath(s): {bath}</Typography>
                                        <Typography variant="h4">Square Footage: {sq}</Typography>
                                    </Grid>
                                </Grid>
                                <FormControl>
                                    <CurrencyInput placeholder="$ ..." prefix="$" onChange={event => setGuessInput(event.target.value)}></CurrencyInput>
                                    <Button onClick={handleSubmit}><strong>ENTER</strong></Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item></Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Game