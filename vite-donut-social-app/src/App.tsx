import Register from "./Register";
import Header from "./Header";
import Home from './Home'

import {BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <div>
        <Header />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/home" element={<Home/>}/>
          </Routes>
      </BrowserRouter>
      </div>
    );
  }

  export default App;