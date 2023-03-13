import React from 'react'
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap'
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
                        <option>Chamber</option>
                        <option value="House">House</option>
                        <option value="Senate">Senate</option>
                    </Form.Select></Col>
                    <Col>
                    <Form.Select aria-label="Political Party">
                        <option>Party</option>
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
                <br></br>
                <br></br>
                <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    States
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Form.Check 
                    className="m-2"
                    type="checkbox"
                    id="checkbox-state"
                    label="Alabama"
                    />
                                <Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="Alaska"
                    />
                                    <Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="Arizona"
                    />

<Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="Arkansas"
                    />

<Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="California"
                    />

<Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="Colorado"
                    />

<Form.Check 
                    type="checkbox"
                    className="m-2"
                    id="checkbox-state"
                    label="Connecticut"
                    />

                    <Dropdown.Item href="#/action-1">Alabama</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Alaksa</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Arizona</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Arkansas</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">California</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Colorado</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Connecticut</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Delaware</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Florida</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Georgia</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Hawaii</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Idaho</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Illinois</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Indiana</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br><br></br>
                <br></br><br></br>
                <br></br><br></br>
                <br></br><br></br>
                <br></br>
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
