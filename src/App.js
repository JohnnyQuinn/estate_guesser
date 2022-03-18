import './App.css';
import { Routes, Route} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Landing from './components/landing'; 
import Game from './components/game';
import GameOver from './components/game-over'

// custom CSS override 
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: '#3D84A8',
          fontSize: '2rem',
          fontFamily: 'Baloo 2' 
        },
      },
      variants: [{
        props: {color: 'secondary'},
        style: {
          backgroundColor: '#48466D'
        }
      }]
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#7F7D9D',
          borderRadius: '21px',
          padding:'0'
        }
      }
    }
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App"> 
            <Routes>
              <Route exact path="/" element={<Landing />}/>
              <Route path="/game" element={<Game/>}/>
              <Route path="/game-over" element={<GameOver/>}/>
            </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App;
