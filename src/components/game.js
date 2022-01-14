import React from 'react';
import { Card, Container, Row, Col, Carousel, Form, Button } from 'react-bootstrap';
import HomeData from "../home-data/home-data-complete.json"

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            // set first img to same size as others
            cardImgStyle: {
                width: '576px', 
                height: '432px'
            },
            guessInput: '',
            guessFinal: '',
            guessDiff: 0,
            price: 0,
            gamePage: Number(localStorage.getItem('gamePage')),
            homePics: [],
            location: '',
            bed: '',
            bath: '',
            sq: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // sets the price variable equal to the price from homeData based on the current gamePage
    setCurrData() {
        this.state.price = HomeData[this.state.gamePage]["price"];
        this.state.homePics = HomeData[this.state.gamePage]["homePics"]
        this.state.location = HomeData[this.state.gamePage]['location']
        this.state.bed = HomeData[this.state.gamePage]['bed']
        this.state.bath = HomeData[this.state.gamePage]['bath']
        this.state.sq = HomeData[this.state.gamePage]['sq']
    }

    handleChange(event) {    
        this.setState({guessInput: event.target.value});  
    }

    handleSubmit() {
        this.state.guessFinal = Number(this.state.guessInput)
        // compares user guess with actual price
        this.state.guessDiff = this.state.price - this.state.guessFinal
        localStorage.setItem('gamePage', Number(this.state.gamePage + 1))
        alert(`The actual price was: $${this.state.price}\nYour guess: $${this.state.guessFinal}\nThe difference is: $${this.state.guessDiff}`)
    }

    render() {    
        this.setCurrData()
        console.log(`localStorage: ${localStorage.getItem('gamePage')}`)
        console.log(`this.state.gamePage: ${this.state.gamePage}`)
        return (
            <div className="game">
                <p>{this.state.other}</p>
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
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group>
                                            <Form.Label><h3>Guess The Price!</h3></Form.Label>
                                            <Form.Control size="lg" type="text" placeholder='$ ...' onChange={this.handleChange}></Form.Control>
                                        </Form.Group>
                                        <Button variant="primary" type="submit"><strong>SUBMIT</strong></Button>
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