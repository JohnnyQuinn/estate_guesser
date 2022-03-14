import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Landing from './components/landing'; 
import Game from './components/game';

function App() {
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
