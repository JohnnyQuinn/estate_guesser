import { useState, useRef } from 'react'
import Button from '@mui/material/Button';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const navStyle = {
    width: '100%',
    justifyContent: 'space-between', 
    display: 'flex', 
    flexDirection: 'row'

}

function NavBar() {
    return (
        <div className="navbar" align-items="stretch">
            <nav style={navStyle}>
                <h1><a href="/">EstateGuesser</a></h1>
                <Button><QuestionMarkIcon fontSize="large"/></Button>
            </nav>
        </div>
    )
}
export default NavBar