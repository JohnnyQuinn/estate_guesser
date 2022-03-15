import React, { useState, useEffect} from 'react';
import { Card, Container, Row, Col, Carousel, Form, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import HomeData from "../home-data/home-data.json"
import CurrencyInput from 'react-currency-input-field';

function Game() {
    let guessFinal = ''
    let guessDiff = 0
    let gamePage = Number(localStorage.getItem('gamePage'))
    let randomHouseIndexes = localStorage.getItem('randomHouseIndexes')
    // HomeData
    let price = 0
    let homePics = []
    let location = ''
    let bed = ''
    let bath = ''
    let sq = ''
    // formats numbers to USD
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    const [guessInput, setGuessInput] = useState('')

    const [showResult, setShowResult] = useState(false)

    const navigate = useNavigate()

    // set first img to same size as others
    let cardImgStyle = {
        width: '576px', 
        height: '432px'
    }
    let resultsDisplay = {
        display: 'none'
    }
    let formDisplay = {
        display: 'inline-block'
    }

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

    function setCurrData() {
        //gets random number to use for the index from houseIndex based on the current gamePage
        const index = randomHouseIndexes[gamePage]
        console.log(`index: ${index}`)
        price = Number(HomeData[index]["price"]);
        homePics = HomeData[index]["homePics"]
        location = HomeData[index]['location']
        bed = HomeData[index]['bed']
        bath = HomeData[index]['bath']
        sq = HomeData[index]['sq']
    }

    function handleSubmit() {
        guessFinal = Number(((guessInput).slice(1)).replace(/,/g, ''))
        // compares user guess with actual price
        guessDiff = formatter.format(price - guessFinal)
        setShowResult(true)
    }

    const Result = () => {
        return (
            <Form onSubmit={handleNext}>
                <h2>Actual Price: {formatter.format(HomeData[gamePage]["price"])}</h2>
                <h2>Your Guess: {formatter.format(guessFinal)}</h2>
                <Button variant="primary" type="submit" onClick={handleNext}><strong>NEXT</strong></Button>
            </Form>
        )
    }

    // handles when the NEXT button is press
    // NEXT button is type="submit" so it reloads the page (and when the page reloads it will be different because the gamePage value is changed)
    function handleNext() {
        gamePage += 1 
        if(gamePage > 9){
            navigate('/game-over')
        } else {
            localStorage.setItem('gamePage', gamePage)
        }
    }

    console.log(`gamePage: ${gamePage}, typeof: ${typeof(gamePage)}`)
    console.log(`randomHouseIndexes: ${randomHouseIndexes}`)   
    // if the gamePage is over then redirect to the game over page
    formatHouseIndex()
    setCurrData()
    return (
        <div className="game">
            <Container fluid>
                <Row>
                    <Col></Col>
                    <Col xs={9}>
                        <Card border="primary" >
                            <Card.Body>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Carousel>
                                                <Carousel.Item>
                                                    <img style={cardImgStyle} src={homePics[0]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[1]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[2]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[3]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[4]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[5]}/>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <img src={homePics[6]}/>
                                                </Carousel.Item>
                                            </Carousel>
                                        </Col>
                                        <Col>
                                            <Card.Title><h1>Location: </h1>{location}</Card.Title>
                                            <Card.Text><h2>Bed(s):</h2> {bed} </Card.Text>
                                            <Card.Text><h2>Bath(s):</h2> {bath}</Card.Text>
                                            <Card.Text><h2>Square Footage:</h2> {sq}</Card.Text>
                                        </Col>
                                    </Row>
                                </Container>
                                <Form style={formDisplay}>
                                    <Form.Group>
                                        <Form.Label><h3>Guess The Price!</h3></Form.Label>
                                        <CurrencyInput placeholder="$ ..." prefix="$" onChange={event => setGuessInput(event.target.value)}></CurrencyInput>
                                    </Form.Group>
                                    <Button variant="primary" type="button" onClick={handleSubmit}><strong>SUBMIT</strong></Button>
                                </Form>
                                { showResult ? <Result /> : null}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Game