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
    
    const switchtoCongressPage = () => {
        console.log("switching to congress page");
        navigate('/congress')
    }

    const cid_map_test = {"N00003389": "Jane Smith", "N00007360": "John Doe"}

    return (
        <Container>
            <div className="HomePage">
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
                            head to "Filter by Congress" to curate your own filters and 
                            see the resulting diagrams.
                            </p>
                        </div>
                    
                    </Col>
                </Row>
                {/*<Row>
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
                            onClick={switchtoIndustryPage}
                            >
                        Republicans
                    </Button>
                    <Button variant="dark"
                            onClick={switchtoIndustryPage}
                            >
                        Democrats
                    </Button>
                    </Col>

                </Row> */}
                {/*<SankeyChart cid_list="N00007360,N00003389,N00031820"/> */}
                <SankeyChart cid_map={cid_map_test}/>
                <SankeyChart group="Republican"/>
                <SankeyChart group="Democrat"/>
                <SankeyChart group="Senator"/>
                <SankeyChart group="Representative"/>
            </div>
        </Container>
    );
}

export default HomePage;
