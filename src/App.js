import React from 'react';
import './App.css';
// import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Home from './pages';
// import About Us from './pages/about';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'


import HomePage from './pages/HomePage/index.js'
// import AboutUs from './pages/AboutPage/index.js'

function App() {
return (
  <>
      <p> Hello </p>
      <HomePage />
      {/* <Router>
        <Navbar />
        <Routes>
          <Route exact path='/'>
            <HomePage />
          </Route>
          <Route path='/about'>
            <AboutUs />
          </Route>
          <Route path='/contact' element={<Contact/>} />
          <Route path='/blogs' element={<Blogs/>} />
          <Route path='/sign-up' element={<SignUp/>} />
        </Routes>
      </Router> */}
  </>
);
}

export default App;