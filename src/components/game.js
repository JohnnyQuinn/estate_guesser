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
            price: Number(HomeData[0]["price"])
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {    
        this.setState({guessInput: event.target.value});  
    }

    handleSubmit() {
        this.state.guessFinal = Number(this.state.guessInput)
        this.state.guessDiff = this.state.price - this.state.guessFinal
        alert(`The actual price was: $${this.state.price}\nYour guess: $${this.state.guessFinal}\nThe difference is: $${this.state.guessDiff}`)
    }

    render() {    
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
                                                        <img style={this.state.cardImgStyle} src={HomeData[0]["homePics"][0]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][1]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][2]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][3]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][4]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][5]}/>
                                                    </Carousel.Item>
                                                    <Carousel.Item>
                                                        <img src={HomeData[0]["homePics"][6]}/>
                                                    </Carousel.Item>
                                                </Carousel>
                                            </Col>
                                            <Col>
                                                <Card.Title><h1>Location: </h1>{HomeData[0]['location']}</Card.Title>
                                                <Card.Text><h2>Bed(s):</h2> {HomeData[0]['bed']} </Card.Text>
                                                <Card.Text><h2>Bath(s):</h2> {HomeData[0]['bath']}</Card.Text>
                                                <Card.Text><h2>Square Footage:</h2> {HomeData[0]['sq']}</Card.Text>
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