import Button from '@mui/material/Button';
import {Grid} from '@mui/material'
import { useLocation } from 'react-router-dom';

// returns false if the current page is the landing, returns true if its another page
function RenderBrand() {
    const location = useLocation()
    if (location.pathname == '/'){
        return false
    } else {
        return true
    }
}

function NavBar() {
    return (
        <div className="navbar">
            <nav style={{width: '100%', marginLeft: '1%'}}>
                <Grid container flexDirection='row' justifyContent='space-between'>
                    <Grid>{ RenderBrand() &&  <h1 className='brand' id='navBrand'><a href="/">EstateGuesser</a></h1>}</Grid>
                    <Grid><Button>?</Button></Grid>
                </Grid>
            </nav>
        </div>
    )
}
export default NavBar