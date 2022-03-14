import React from 'react';
import { Card, Container, Row, Col, Carousel, Form, Button} from 'react-bootstrap';
import HomeData from "../home-data/home-data-complete.json"
import CurrencyInput from 'react-currency-input-field';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            guessFinal: '',
            guessDiff: 0,
            gamePage: Number(localStorage.getItem('gamePage')),
            houseIndex: localStorage.getItem('houseIndex'), 
            // HomeData
            price: 0,
            homePics: [],
            location: '',
            bed: '',
            bath: '',
            sq: '',
            // formats numbers to USD
            formatter: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
            // set first img to same size as others
            cardImgStyle: {
                width: '576px', 
                height: '432px'
            },
            resultsDisplay: {
                display: 'none'
            },
            formDisplay: {
                display: 'inline-block'
            }
        };

        this.guessInputRef = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    formatHouseIndex() { 
        let strArr = this.state.houseIndex
        strArr = strArr.split(',')
        console.log(strArr)
        for(let i=0;i<strArr.length;i++){
            strArr[i] = (Number(strArr[i]))
        }
        // this.state.houseIndex = strArr
        this.setState({houseIndex: strArr})
        console.log(strArr)
    }

    setCurrData() {
        //gets random number to use for the index from houseIndex based on the current gamePage
        const index = this.state.houseIndex[this.state.gamePage]
        console.log(index)
        this.state.price = Number(HomeData[index]["price"]);
        this.state.homePics = HomeData[index]["homePics"]
        this.state.location = HomeData[index]['location']
        this.state.bed = HomeData[index]['bed']
        this.state.bath = HomeData[index]['bath']
        this.state.sq = HomeData[index]['sq']
    }
    
    handleSubmit() {
        this.state.guessFinal = Number(((this.guessInputRef.current.value).slice(1)).replace(/,/g, ''))
        // compares user guess with actual price
        this.state.guessDiff = this.state.formatter.format(this.state.price - this.state.guessFinal)
        this.setState({resultsDisplay: {
            display: 'block'
        }, 
        formDisplay: {
            display: 'none'
        }})
    }

    // handles when the NEXT button is press
    // NEXT button is type="submit" so it reloads the page (and when the page reloads it will be different because the gamePage value is changed)
    handleNext() {
        localStorage.setItem('gamePage', Number(this.state.gamePage + 1))
    }

    render() {    
        this.formatHouseIndex()
        this.setCurrData()
        console.log(`localStorage gamePage: ${localStorage.getItem('gamePage')}`)
        console.log(`this.state.gamePage: ${this.state.gamePage}`)
        console.log(`this.houseIndex ${this.houseIndex}`)
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
                                                        <img style={this.state.cardImgStyle} src={this.state.homePics[0]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[1]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[2]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[3]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[4]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[5]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={this.state.homePics[6]}/>
                                                    </Carousel.Item>
                                                </Carousel>
                                            </Col>
                                            <Col>
                                                <Card.Title><h1>Location: </h1>{this.state.location}</Card.Title>
                                                <Card.Text><h2>Bed(s):</h2> {this.state.bed} </Card.Text>
                                                <Card.Text><h2>Bath(s):</h2> {this.state.bath}</Card.Text>
                                                <Card.Text><h2>Square Footage:</h2> {this.state.sq}</Card.Text>
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Form style={this.state.formDisplay}>
                                        <Form.Group>
                                            <Form.Label><h3>Guess The Price!</h3></Form.Label>
                                            <CurrencyInput placeholder="$ ..." prefix="$" ref={this.guessInputRef}></CurrencyInput>
                                        </Form.Group>
                                        <Button variant="primary" type="button" onClick={this.handleSubmit}><strong>SUBMIT</strong></Button>
                                    </Form>
                                    <Form style={this.state.resultsDisplay} onSubmit={this.handleNext}>
                                        <h2>Actual Price: {this.state.formatter.format(HomeData[this.state.gamePage]["price"])}</h2>
                                        <h2>Your Guess: {this.state.formatter.format(this.state.guessFinal)}</h2>
                                        <Button variant="primary" type="submit" onClick={this.handleNext}><strong>NEXT</strong></Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Game