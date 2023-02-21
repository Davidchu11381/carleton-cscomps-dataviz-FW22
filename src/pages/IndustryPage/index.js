import React from 'react';
import { Container, Button, Card, Accordion, Row, Col } from 'react-bootstrap';
// import Accordion from 'react-bootstrap/Accordion'

function IndustryPage() {
    return (
        <Container>
        <div className="h1 mb-3 mt-3">Industries and Companies</div>
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Sector 1</Accordion.Header>
                <Accordion.Body>
                    <Card style={{ width: '18rem' }}>
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                        <Card.Body>
                            <Card.Title>Industry Goes Here</Card.Title>
                            <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Sector 2</Accordion.Header>
                <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        {/* Testing code */}
        {/* <Container>
            <Row xs={2} sm={3} md={4} lg={3}>
                <Col><p class="bg-dark">1 of 3</p></Col>
                <Col><Row lg={2}><p class="text-white bg-dark">2 of 3</p><p class="text-white bg-dark">2 of 3</p></Row></Col>
                <Col><p class="bg-dark">3 of 3</p></Col>
                <Col><p class="bg-dark">3 of 3</p></Col>
            </Row>
        </Container> */}
        <Row xs={1} md={4} className="g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
                <Col>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                        This is a longer card with supporting text below as a natural
                        lead-in to additional content. This content is a little bit
                        longer.
                    </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            ))}
        </Row>
        </Container>
    );  
}

export default IndustryPage;
