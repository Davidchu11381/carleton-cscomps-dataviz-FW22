import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
// import YoutubeEmbed from './components/YoutubeEmbed';
import SankeyChart from './components/SankeyChart';
import { useNavigate } from 'react-router-dom';

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
                                MoneyFlow is a web application that contains interactive data visualization
                                show casing information on the various funding sources of politicians in congress. There is
                                also a compiled list of statements/tweets that these politicians have made.
                            </p>
                            <p className="lead">
                                You can explore the relationship of funders to politicians, and what these politicians have
                                said in regards to different topics and issues. 
                                It is not exhaustive, but our team hope it will act as a good starting point for learning and
                                becoming more informed about the US political system. 
                            </p>
                            <p className="lead">
                                Our home page contains sankey diagrams depicting funding sources flowing to different 
                                subsets of politicians. If you'd like to explore further funding flows, you can head 
                                to "Filter by Congress" page to curate your own filters and see the resulting diagrams.
                            </p>
                            
                        </div>
                    </Col>
                    {/* <Col>
                        <div className="pt-3 h4">
                            <p>How To Use</p>
                        </div>
                        <div className="pt-3 mb-3 pb-3 lead">
                            <p>This Overview Page contains sankey diagrams depicting
                            funding sources flowing to different subsets of politicians.</p>
                            <p>If you'd like to explore further funding flows, you can 
                            head to "Filter by Congress" to curate your own filters and 
                            see the resulting diagrams.
                            </p>
                        </div>
                    
                    </Col> */}
                </Row>
                {/* <Row>
                    <Col>
                    <Button variant="dark"
                            onClick={switchtoIndustryPage}
                            >
                        Sort by Industries
                    </Button>
                    <div>
                        <Link to='/AboutUs' className="btn btn-primary">hello</Link>
                    </div>
                    </Col>

                    <Col>
                    <Button variant="dark"
                            onClick={switchtoCongressPage}
                            >
                        Sort by Congresspeople
                    </Button>
                    </Col>

                </Row> */}
                <SankeyChart cid_list="N00007360,N00003389,N00031820"/>
                <SankeyChart cid_list="N00003389"/>
                <SankeyChart group="Republican"/>
                {/*<SankeyChart group="Democrat"/>*/}
            </div>
        </Container>
    );
}

export default HomePage;
