import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
// import YoutubeEmbed from './components/YoutubeEmbed';
import SankeyChart from './components/SankeyChart';
import { renderMatches, useNavigate } from 'react-router-dom';

function HomePage() {

    const navigate = useNavigate();

    const switchtoIndustryPage = () => {
        console.log("switching to industry page");
        navigate('/industry');
    }

    const showRepublicans = () => {
        //????
        document.getElementById("Republicans").style.display = "block";
    }
    
    const switchtoCongressPage = () => {
        console.log("switching to congress page");
        navigate('/congress')
    }

    return (
        <Container>
            <div className="HomePage">
                <Row>
                    <Col>
                        <div className="pt-3 h3">
                            What is MoneyFlows?
                        </div>
                        <div className="pt-3" >
                            <p className="lead">
                                MoneyFlows is a web application that lets you explore the relationships between funding sources and speech
                                for members of congress. We have gathered data on funding broken down by industry, statements made on the floor
                                of congress, and tweets for each politician. We then performed topic modeling on the statements and tweets
                                to gather quantitative data about what topics politicians speek about.
                            </p>
                            
                        </div>
                    </Col>
                    <Col>
                        <div className="pt-3 h4">
                            <p>Interacting with Our Data</p>
                        </div>
                        <div className="pt-3 mb-3 pb-3 lead">
                            <p>You can explore these relationships through Sankey diagrams, which show the flows of money
                            to congresspeople and congresspeople to topics. To see data aggregated by group, such as
                            Republicans or Senators, click on the appropriate group below. To look at a specific congressperson
                            or set of congresspeople, go to our Congress Members tab.</p>
                    
                        </div>
                        {/* <YoutubeEmbed embedId="ugrcQhQm4YI" /> */}
                    
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>

                    <Col>
                    <Button variant="dark"
                            onClick={switchtoCongressPage}
                            >
                        Senators
                    </Button>
                    <Button variant="dark"
                            onClick={switchtoCongressPage}
                            >
                        Representatives
                    </Button>
                    <Button variant="dark"
                            onClick={showRepublicans}
                            >
                        Republicans
                    </Button>
                    <Button variant="dark"
                            onClick={switchtoIndustryPage}
                            >
                        Democrats
                    </Button>
                    </Col>

                </Row> 
                {/*<SankeyChart cid_list="N00007360,N00003389,N00031820"/>
                <SankeyChart cid_list="N00003389"/>*/}
                <SankeyChart group="Republican"/>
                <SankeyChart group="Democrat"/>
                <SankeyChart group="Senator"/>
                <SankeyChart group="Representative"/>
            </div>
        </Container>
    );
}

export default HomePage;
