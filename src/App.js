import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/HomePage/index.js'
import AboutUs from './pages/AboutPage/index.js'
import NavbarBand from './components/Navbar.js'
import IndustryPage from './pages/IndustryPage';
import PersonPage from './pages/PersonPage';
import TopicPage from './pages/TopicPage';

function App() {
    return (
    <>
        <Router>
            <NavbarBand />
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                <Route path='/aboutUs' element={<AboutUs />} />
                <Route path='/industry' element={<IndustryPage />} />
                <Route path='/congress' element={<PersonPage />} />
                <Route path='/topic' element={<TopicPage />} />
            </Routes>
        </Router>
    </>
    );
}

export default App;