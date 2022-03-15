import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
 
function GameOver() {
    const totalDiff = Number(localStorage.getItem('totalDiff'))
    const smallestDiff = Number(localStorage.getItem('smallestDiff'))// formats numbers to USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    return (
        <div className='gameOver'>
            <Container fluid>
                <Row>
                    <Col></Col>
                    <Col xs={9}>
                        <Card border="primary">
                            <Card.Body>
                                <Card.Title><h1>Game Over</h1></Card.Title>
                                <Card.Text><h2>Total difference: {formatter.format(totalDiff)}</h2></Card.Text>
                                <Card.Text><h2>Smallest difference: {formatter.format(smallestDiff)}</h2></Card.Text>
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