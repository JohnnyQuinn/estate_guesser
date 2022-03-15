import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
 
function GameOver() {
    return (
        <div className='gameOver'>
            <Container fluid>
                <Row>
                    <Col></Col>
                    <Col xs={9}>
                        <Card border="primary">
                            <Card.Body>
                                <Card.Title><h1>Game Over</h1></Card.Title>
                                <Card.Text><h2>Total difference: </h2></Card.Text>
                                <Card.Text><h2>Smallest difference: </h2></Card.Text>
                                <Button variant="primary"><Link to="/" style={{ color: "white" }}> HOME </Link></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )
}

export default GameOver