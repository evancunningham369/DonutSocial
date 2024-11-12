import Register from "./Register";
import Header from "./Header";
import Home from './Home';
import Profile from "./Profile";

import {BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/profile/:userId/:username" element={<Profile/>}/>
          </Routes>
      </BrowserRouter>
      </>
    );
  }

  export default App;