import React from 'react';
import { Card, Container, Row, Col, Carousel, Form, Button, Alert} from 'react-bootstrap';
import HomeData from "../home-data/home-data-complete.json"
import CurrencyInput from 'react-currency-input-field';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            guessFinal: '',
            guessDiff: 0,
            gamePage: Number(localStorage.getItem('gamePage')),
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

        const asdf = 0

        this.guessInputRef = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    // sets the price variable equal to the price from homeData based on the current gamePage
    setCurrData() {
        this.state.price = Number(HomeData[this.state.gamePage]["price"]);
        this.state.homePics = HomeData[this.state.gamePage]["homePics"]
        this.state.location = HomeData[this.state.gamePage]['location']
        this.state.bed = HomeData[this.state.gamePage]['bed']
        this.state.bath = HomeData[this.state.gamePage]['bath']
        this.state.sq = HomeData[this.state.gamePage]['sq']
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
        // localStorage.setItem('gamePage', Number(this.state.gamePage + 1))
        // alert(`The actual price was: ${this.state.formatter.format(HomeData[this.state.gamePage]["price"])}\nYour guess: ${this.state.formatter.format(guessFinal)}\nThe difference is: ${this.state.guessDiff}`)
    }

    handleNext() {
        localStorage.setItem('gamePage', Number(this.state.gamePage + 1))
    }

    render() {    
        this.setCurrData()
        console.log(`localStorage: ${localStorage.getItem('gamePage')}`)
        console.log(`this.state.gamePage: ${this.state.gamePage}`)
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