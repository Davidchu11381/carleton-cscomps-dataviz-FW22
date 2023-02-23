import React from 'react'
import {Col, Row, Container} from 'react-bootstrap'
function AboutUs() {
    return (
    <Container>
        <Row>
        <Col>
            <div className="h1 mb-3 mt-3">About Us</div>
            <div className="lead mt-3 me-2"> 
                <p>We are a team of 6 computer scientists 
                with a mission to increase government transparency 
                and accountability through effective data visualization.</p>
                <p>There is an overwhelming amount of data out there, and it can be hard
                    to find what you are really looking for. We hope this site
                    offers a clear and interesting way
                    to explore who is funding our congresspeople, and what these politicians are talking about. 
                </p>
            </div>
        </Col>
        <Col>
            <div className="h1 mb-3 mt-3">Team</div>
            <div className="lead mt-3"> 
            <Row className="mb-3">
                <Col>
                <p>Anna</p>
                </Col>
                <Col>
                <p>Ben</p>
                </Col>
                <Col>
                <p>Chisom</p>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                <p>David</p>
                </Col>
                <Col>
                <p>Kevin</p>
                </Col>
                <Col>
                <p>Lita</p>
                </Col>   
            </Row> 
            </div>
        </Col>
        </Row>
    </Container>
    );
}

export default AboutUs;
