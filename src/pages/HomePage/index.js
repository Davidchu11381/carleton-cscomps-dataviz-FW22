import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
// import YoutubeEmbed from './components/YoutubeEmbed';
// import SankeyChart from './components/SankeyChart';
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
                            What is MoneyFlow?
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
                            
                        </div>
                    </Col>
                    <Col>
                        <div className="pt-3 h4">
                            <p>Interacting with the Sankey Diagram</p>
                        </div>
                        <div className="pt-3 mb-3 pb-3 lead">
                            <p>You can filter the diagrams based on the three sections: 
                            Industries, Congresspeople, and Topics/Issues. If you are curious
                            about the congresspeople from your state. There is a filter next to
                            the heading in which you can simply click on the state(s) you want to see. </p>
                            <p>If you would like to dig deeper into a particular industry, congress person
                                or topics, simply click on it in the diagram so it will take you to the in depth 
                                page(s) that will tell you more about them.
                            </p>
                        </div>
                        {/* <YoutubeEmbed embedId="ugrcQhQm4YI" /> */}
                    
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Button variant="dark"
                            onClick={switchtoIndustryPage}
                            >
                        Sort by Industries
                    </Button>
                    {/* <div>
                        <Link to='/AboutUs' className="btn btn-primary">hello</Link>
                    </div> */}
                    </Col>

                    <Col>
                    <Button variant="dark"
                            onClick={switchtoCongressPage}
                            >
                        Sort by Congresspeople
                    </Button>
                    </Col>

                </Row>
                {/* <SankeyChart /> */}
            </div>
        </Container>
    );
}

export default HomePage;
