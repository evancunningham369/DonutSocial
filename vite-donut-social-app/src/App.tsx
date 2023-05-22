import Register from "./Register";
import Header from "./Header";
import Home from './Home';
import Profile from "./Profile";

import {BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <div>
        <Header />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
      </BrowserRouter>
      </div>
    );
  }

  export default App;