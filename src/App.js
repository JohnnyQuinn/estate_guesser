import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Route, Router} from 'react-router-dom';

import Landing from './components/landing'; 

function App() {
  return (
    <div className="App">
      <Landing />
    </div>
  );
}

export default App;
