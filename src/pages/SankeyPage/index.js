import React from 'react'
import { Col, Row, Container, Stack, Form, Card, Dropdown } from 'react-bootstrap'
// import { ButtonGroup, ToggleButton, ListGroup, ListGroupItem } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer } from 'react';
import PoliticianButton from './components/PoliticianButton';

import { reducer, initialState } from './hooks/reducer';

// TALK ABOUT IN COMPS TOMORROW
// when click on the line between fields == info?
// illustrates backing of politicians (aka lobbying)

// need "space" for already-selected politicians
// states may be a drop-down selection (just to be easier)
// GOAL: focus on connecting filtering with data viz

function SankeyPage() {

    const [filters, dispatch] = useReducer(reducer, initialState);

    const stateList = ['Alabama','Alaska','Arizona','Arkansas',
        'California','Colorado','Connecticut','Delaware','Florida',
        'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
        'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
        'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
        'Nevada','New Hampshire','New Jersey','New Mexico','New York',
        'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
        'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
        'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

    // id = openSecretsAPI
    const personTest = [{id: "Pelosi", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
                        {id: "McConnell", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
                        {id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
                        {id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
                        {id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"}]

    function displayButtons() {
        console.log("HERE IN DISPLAY BUTTONS", filters.filteredPoliticians);
        if (filters.filteredPoliticians.length === 0) {
            console.log("in the case of no one");
            return(filters.originalPolList.map(person => 
            <PoliticianButton politician={person} func={dispatch}></PoliticianButton>));
        } else {
            return (filters.filteredPoliticians.map(person => 
            <PoliticianButton politician={person} func={dispatch}></PoliticianButton>));
        };
    }

    // /**
    //  * Filter array items based on search criteria (query)
    //  */
    function filterItems(arr, query) {
        // console.log("the arra given:", arr);
        return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }

    // function listStates(list) {
    //     return list.map(state => 
    //         <ListGroupItem> {state} </ListGroupItem>)
    // }

    const handleFilter = (event) => {        
        var eligibleStates = filterItems(stateList, event.target.value);
        console.log(eligibleStates);
        // var stuff = filterPoliticians(filters);
        // console.log(stuff);
        // return stateList.map(dep =>
        //     <option key={dep}>{dep}</option>
        // ); 
    }

    useEffect(() => {
        console.log("ins index.js:", filters);
    }, [filters]);
   
    return (
    <Container>
        <Row>
            <Col lg={4}>
                <Stack gap={2}>
                    <h4>Filter by party, chamber, state</h4>
                    <Row lg={2}>
                        <Col>
                            <Form.Select aria-label="party-select" 
                                size="sm"
                                id="party"
                                onChange={(event) => {
                                    // console.log(event.target.value);
                                    console.log("about to update selection with PARTY");

                                    dispatch({
                                        type: 'UPDATE_BUTTONS', 
                                        party: event.target.value,
                                        chamber: filters.chamber,
                                        selectedStates: filters.selectedStates,
                                    })
                                }}>
                                <option>Party</option>
                                <option value="Democrat">Democrat</option>
                                <option value="Republican">Republican</option>
                                <option value="">Other</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select aria-label="chamber-select"
                                size="sm"
                                id="chamber"
                                onChange={(event) => {
                                    console.log(event.target.value);
                                    console.log("about to update selectio with CHAMBER");
                                    dispatch({
                                        type: 'UPDATE_BUTTONS', 
                                        party: filters.party,
                                        chamber: event.target.value,
                                        selectedStates: filters.selectedStates,
                                    });
                                }}>
                                <option value="">Chamber</option>
                                <option value="House">House of Representatives</option>
                                <option value="Senate">United States Senate</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row lg={1}>
                        <Col>
                            <Form.Control 
                                size="sm" 
                                type="text" 
                                placeholder="State" 
                                class="mb-3"
                                onChange={handleFilter}
                                />
                        
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                States
                            </Dropdown.Toggle>

                            {/* <Form></Form> */}

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                <Form>
                                {['checkbox', 'radio'].map((type) => (
                                <div key={`default-${type}`} className="mb-3">
                                <Form.Check 
                                    type={type}
                                    id={`default-${type}`}
                                    label={`default ${type}`}
                                    // feedback={}
                                />

                                <Form.Check
                                    disabled
                                    type={type}
                                    label={`disabled ${type}`}
                                    id={`disabled-default-${type}`}
                                />
                                </div>
                                
                            ))}</Form>
                            </Dropdown.Menu>
                        </Dropdown>
                        </Col>
                       
                    </Row>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Text>
                            PLEASE SELECT MULTIPLE POLITICIANS BECAUSE IT IS POSSIBLE
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    {/* where the array of politicians will be listed */}
                    <Container>
                        <Row sm={2} md={2} lg={3}>
                        {/* listing of the congresspoeple that fit the criteria go here */}
                        {displayButtons()}
                        </Row>
                    </Container>
                </Stack>
            </Col>
            <Col>
                <div className='sankey-diagram'>
                    <SankeyChart />
                </div>
            </Col>
        </Row>
    </Container>
    );
}

export default SankeyPage;
