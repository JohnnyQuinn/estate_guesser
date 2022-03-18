import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import HomeData from "../home-data/home-data.json"
import CurrencyInput from 'react-currency-input-field';
import Navbar from './navbar'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import CardContent from '@mui/material/CardContent';
import { FormLabel, InputAdornment } from '@mui/material';
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
        currency: 'USD',
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
    function handleEnter() {
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

        setShowResult(!showResult)
        setShowGuess(!showGuess)
    }

    // > handles when the NEXT button is press and will redirect to the game-over component if the user finishes guessing 10 houses
    // > NEXT button is type="submit" so it reloads the page (and when the page reloads it will be different because the gamePage value is changed)
    function handleNext() {
        gamePage += 1 
        if(gamePage > 9){
            navigate('/game-over')
        } else {
            localStorage.setItem('gamePage', gamePage)
            setShowResult(!showResult)
            setShowGuess(!showGuess)
            setGuessInput(0)
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
                    <Grid item xs></Grid>
                    <Grid item xs={11}>
                        <Card height='auto' width='auto' style={{}}>
                            <CardContent>
                                <h3 style={{textAlign:'left', marginBottom:'1%'}}>{gamePage}/10</h3>
                                <Grid container direction="row" justifyContent="center" rowSpacing={1}>
                                    <Grid container xs fluid justifyContent="flex-start" > 
                                        <Carousel autoPlay={false}
                                            indicatorContainerProps={{
                                                style: {
                                                    width:'40rem',
                                                    marginTop:'28.5rem'
                                                }
                                            }}
                                            fullHeightHover={true}
                                        >
                                            { homePics.map((i) => <img src={i} style={{width:'100%'}}/>)}
                                        </Carousel>
                                    </Grid>
                                    <Grid xs={4} style={{width:'100%'}}>
                                        <Grid container direction='column' justifyContent='space-evenly' textAlign="left">
                                            <h3 variant="h4">Location: <p>{location}</p></h3>
                                            <h3 variant="h4">Bed(s): <p>{bed}</p></h3>
                                            <h3 variant="h4">Bath(s): <p>{bath}</p></h3>
                                            <h3 variant="h4">Square Footage: <p>{sq}</p></h3>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container direction='row' justifyContent='flex-start' >
                                    {showGuess && 
                                            <FormControl style={{width:'76%'}}>
                                                <FormLabel style={{width:'40%', textAlign:'left'}}><h2 style={{marginBottom:'0'}}>Guess The Price!</h2></FormLabel>
                                                <Grid container justifyContent='flex-start' direction='row' style={{height:'40%'}}>
                                                    <CurrencyInput style={{width:'75%', height:'100%', borderRadius:'10px'}} placeholder="$ ..." prefix="$" onChange={event => setGuessInput(event.target.value)}></CurrencyInput>
                                                    <Button style={{width:'20%', height:'100%', marginLeft:'2%'}} onClick={handleEnter} color='secondary'><strong>ENTER</strong></Button>
                                                </Grid>
                                            </FormControl>
                                    }
                                    { showResult ? 
                                        <FormControl style={{width:'70%'}}>
                                            <Grid direction='column' justifyContent='flex-start' textAlign='left'>
                                                <h2>Actual Price: {formatter.format(HomeData[gamePage]["price"])}</h2>
                                                <Grid container direction='row' justifyContent='space-between'>
                                                    <h2>Your Guess: {formatter.format(guessFinal)}</h2>
                                                    <Button variant="contained" type="submit" onClick={handleNext} color='secondary'><strong>NEXT</strong></Button>
                                                </Grid>
                                            </Grid>
                                        </FormControl> 
                                    : null}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs></Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Game