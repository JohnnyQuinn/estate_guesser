import React from 'react';
import { Card, Container, Row, Col, Carousel, Form, Button } from 'react-bootstrap';
import HomeData from "../home-data/home-data-complete.json"

function Game() {

    // set first img to same size as others
    const cardImgStyle = {
        width: '576px', 
        height: '432px'
    }

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
                                                    <img style={cardImgStyle} src={HomeData[0]["homePics"][0]}/>
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
                                <Form>
                                    <Form.Group>
                                        <Form.Label><h3>Guess The Price!</h3></Form.Label>
                                        <Form.Control size="lg" type="text" placeholder='$ ...'></Form.Control>
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

export default Game