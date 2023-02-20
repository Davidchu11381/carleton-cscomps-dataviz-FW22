import React, { useEffect } from 'react';
// import { useState, useReducer } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
// import SankeyChart from './components/SankeyChart';
// import style from "./index.module.css"

function DataPage() {

    return (
        <Container>
            <div className="DataPage">
                <Row><div></div></Row>
                <Row>
                    <div className="pt-3 h2" id="#funding">Funding Data</div>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className="pt-3 h2" id="#tweets">Tweet Data</div>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className="pt-3 h2" id="#statements">Statement Data</div>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                         pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                         culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className="lead">
                    <p>Funding data: OpenSecrets API | 
                        Tweet Data: from the Twitter API | 
                        Statement Data: from congress.gov</p>
                    </div>
                </Row>
                <Row>
                    <div classname="pt-3 h3">
                        <p className='lead'>
                            Tools that we used to analyze the data: LDA
                        </p>
                    </div>
                </Row>
                <Row>
                    <div classname="pt-3 h3">
                        <p className="lead">
                            Tools used to display the data: google charts Sankey diagram
                        </p>
                    </div>
                </Row>
            </div>
        </Container>
    );
}

export default DataPage;

// OLD CODE

    // const navigate = useNavigate();
    // const switchtoIndustryPage = () => {
    //     console.log("switching to industry page");
    //     navigate('/industry');
    // }
    
    // const switchtoCongressPage = () => {
    //     console.log("switching to congress page");
    //     navigate('/congress')
    // }