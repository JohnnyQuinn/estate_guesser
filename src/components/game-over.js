import React from 'react'
import { Card, CardContent, Grid, Button } from '@mui/material'
import Navbar from './navbar'
 
function GameOver() {
    const totalDiff = Number(localStorage.getItem('totalDiff'))
    const smallestDiff = Number(localStorage.getItem('smallestDiff'))// formats numbers to USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    return (
        <div className='gameOver'>
            <Navbar/>
            <Grid container direction='row' style={{marginTop:'10%'}}>
                <Grid item xs></Grid>
                    <Grid item xs={8}>
                        <Card style={{paddingTop:'5%', paddingBottom:'5%'}}>
                            <CardContent>
                                <h1>Game Over</h1>
                                <h2>Total difference: {formatter.format(totalDiff)}</h2>
                                <h2>Smallest difference: {formatter.format(smallestDiff)}</h2>
                                <Button variant="contained" href='/'>HOME</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    )
}

export default GameOver