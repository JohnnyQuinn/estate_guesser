import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { createContext ,useState } from 'react';

import Landing from './components/landing'; 
import Game from './components/game';


export const GameContext = createContext()

function App() {
  const [gamePage, setGamePage] = useState(0)
  const [houseIndexArr, setHouseIndexArr] = useState([])
  return (
    <div className="App"> 
        <Routes>
          <Route exact path="/" element={<Landing />}/>
          <Route path="/game" element={<Game/>}/>
        </Routes>
    </div>
  );
}

export default App;
