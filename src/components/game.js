import React from 'react';
import { Card, Container, Row, Col, Carousel } from 'react-bootstrap';
import HomeData from "../home-data/home-data-complete.json"

function Game() {
    return (
        <div className="game">
            <Container fluid>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card border="primary">
                            <Card.Body>
                                <Carousel>
                                    <Carousel.Item>
                                        <img src={HomeData[0]["homePics"][0]}/>
                                    </Carousel.Item>
                                </Carousel>
                                <Card.Title>asdf</Card.Title>
                                <Card.Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Card.Text>
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