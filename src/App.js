import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/HomePage/index.js'
import AboutUs from './pages/AboutPage/index.js'
import NavbarBand from './components/Navbar.js'
import IndustryPage from './pages/IndustryPage';
import PersonPage from './pages/PersonPage';
import CongressPage from './pages/CongressPage'
import BarChartPage from './pages/BarChartPage';
import SankeyPage from './pages/SankeyPage';


function App() {
    return (
    <>
        <Router>
            <NavbarBand />
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                <Route path='/aboutUs' element={<AboutUs />} />
                <Route path='/industry' element={<IndustryPage />} />
                <Route path='/individual' element={<PersonPage />} />
                <Route path='/barchart' element={<BarChartPage />} />
                <Route path='/congress' element={<CongressPage />} />
                <Route path='/sankey' element={<SankeyPage />} />
            </Routes>
        </Router>
    </>
    );
}

export default App;