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
                <Row>
                    <Col>
                        <div className="pt-3 h3">
                            Overview
                        </div>
                        <div className="pt-3" >
                            <p className="lead">
                                MoneyFlow is a web application that lets you explore the relationships between funding sources and speech
                                for members of congress. We have gathered data on funding broken down by industry, statements made on the floor
                                of congress, and tweets for each politician. We then performed topic modeling on the statements and tweets
                                to gather quantitative data about what topics politicians speek about.
                            </p>
                            
                        </div>
                    </Col>
                    <Col>
                        <div className="pt-3 h4">
                            <p>How To Use</p>
                        </div>
                        <div className="pt-3 mb-3 pb-3 lead">
                            <p>You can explore these relationships through Sankey diagrams, which show the flows of money
                            to congresspeople and congresspeople to topics. This Overview Page contains diagrams depicting
                            different subsets of politicians, like Republicans or Senators</p>
                            <p>If you'd like to explore further funding flows, you can 
                            head to <a href="/congress_data">Filter by Congress</a> to curate your own filters and 
                            see the resulting diagrams.
                            </p>
                        </div>
                    </Col>
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