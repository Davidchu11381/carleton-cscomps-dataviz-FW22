import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import AboutUs from './pages/AboutPage/index.js'
import NavbarBand from './components/Navbar.js'
import DataPage from './pages/DataPage';
import SankeyPage from './pages/SankeyPage';
// import OverviewPage from './pages/old_pages/OverviewPage'
// import CongressPage from './pages/old_pages/CongressPage'

function App() {
    return (
    <>
        <Router>
            <NavbarBand />
            <Routes>
                <Route exact path='/' element={<SankeyPage />} />
                <Route path='/aboutUs' element={<AboutUs />} />
                {/* <Route path='/congress' element={<CongressPage />} /> */}
                <Route path='/data' element={<DataPage />} />
                {/* <Route path='/overview' element={<OverviewPage />} /> */}
            </Routes>
        </Router>
    </>
    );
}

export default App;