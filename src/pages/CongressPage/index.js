import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

function CongressPage() {

    const navigate = useNavigate();

    // const [numberCards, setNumberCards] = useState[0];
    const type = "primary";

    const switchtoNancyPage = () => {
        console.log("switching to congress page");
        navigate('/individual')
    }

    return (
    <Container>
        <div className="h1 mb-3 mt-3">Listing of Congresspeople</div>
        <Row>
            <Col>
                <Row lg={3}>
                    <Col>
                    <Form.Select aria-label="Chamber">
                        <option>Congress Chamber</option>
                        <option value="House">House</option>
                        <option value="Senate">Senate</option>
                    </Form.Select></Col>
                    <Col>
                    <Form.Select aria-label="Political Party">
                        <option>Political Party</option>
                        <option value="Democrat">Democrat</option>
                        <option value="Republican">Republican</option>
                    </Form.Select></Col>
                    <Col>
                    <Form.Select 
                        aria-label="State"
                        id="state"
                        onChange={(event) => {
                            // dispatch({
                            //     type: 'ROOM_SELECT',
                            //     value: {
                            //         count: event.target.value,
                            //     },
                            // });
                            console.log(event.target.value);
                        }}
                    >
                        <option>State</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select></Col>
                </Row>
                <Container>
                    <Row sm={2} md={2} lg={4}>
                        <Card border={type} style={{ width: '18rem' }}>
                                {/* <Card.Img variant="top" src="..public/albedo.JPG" fluid /> */}
                                <Card.Body>
                                    <Card.Title>Nancy Pelosi (D)</Card.Title>
                                    <Card.Text>
                                    House, California
                                    </Card.Text>
                                    <Button variant="primary"
                                            onClick={switchtoNancyPage}
                                            >
                                        Profile</Button>
                                </Card.Body>
                            </Card>
                        <Card border="danger" style={{ width: '18rem' }}>
                                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                <Card.Body>
                                    <Card.Title>Mitch McConnel (R)</Card.Title>
                                    <Card.Text>
                                    Senate, Kentucky
                                    </Card.Text>
                                    <Button variant="primary">Profile</Button>
                                </Card.Body>
                            </Card>
                    </Row>
                </Container>
            </Col>
            <Col lg={4}>
                <Row>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Row>
                <Row>
                <div class="bg-light">
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. 
                    </p>
                </div>
                </Row>
            </Col>
        </Row>
    </Container>
    );
}

export default CongressPage;
