import React from 'react'
import { Col, Row, Container, Stack, Form, Card, Button, Dropdown } from 'react-bootstrap'
// import { ButtonGroup, ToggleButton, ListGroup, ListGroupItem } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer } from 'react';
import PoliticianButton from './components/PoliticianButton';
import StateButton from './components/StateButton';

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
        // console.log(eligibleStates);
        // console.log(event.code);
        if (event.code === "Enter") {
            console.log("AN ENTER KEY WAS PRESSED");
            if (eligibleStates.length === 1) {
                dispatch({
                    type: 'ADD_STATE',
                    value: eligibleStates[0],
                })
            }
        }
        // console.log(event.target.value);
        // if (event)
        // var stuff = filterPoliticians(filters);
        // console.log(stuff);
        // return stateList.map(dep =>
        //     <option key={dep}>{dep}</option>
        // ); 
    }

    useEffect(() => {
        console.log("ins index.js:", filters);
        // console.log("filtered states:", filters.selectedPoliticians);
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
                                    dispatch({
                                        type: 'UPDATE_BUTTONS', 
                                        party: event.target.value,
                                        chamber: filters.chamber,
                                        selectedStates: filters.selectedStates,
                                    })
                                }}>
                                <option value="">Party</option>
                                <option value="Democrat">Democrat</option>
                                <option value="Republican">Republican</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select aria-label="chamber-select"
                                size="sm"
                                id="chamber"
                                onChange={(event) => {
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
                           
                        <Dropdown drop='end'>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                States
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {stateList.map((state) => (
                                    <Dropdown.Item>
                                        <Form.Check
                                            feedback="i was clicked!"
                                            type='checkbox'
                                            id={state}
                                            label={state}
                                        />
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown> 
                        {/* state type bar */}
                            <Form.Control 
                                size="sm" 
                                type="text" 
                                placeholder="State" 
                                class="mb-3"
                                // onChange={handleFilter}
                                onKeyDown={handleFilter}
                                />
                                {filters.selectedStates.map((state) => (
                                    <StateButton state={state} func={dispatch}></StateButton>
                                ))}
                        </Col>
                       
                    </Row>
                    {/* <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Text>
                            PLEASE SELECT MULTIPLE POLITICIANS BECAUSE IT IS POSSIBLE
                            </Card.Text>
                        </Card.Body>
                    </Card> */}
                    {/* where the array of politicians will be listed */}
                    <Container>
                        <Row sm={2} md={2} lg={3}>
                        {/* listing of the congresspoeple that fit the criteria go here */}
                        {displayButtons()}
                        </Row>
                    </Container>
                    <Container>
                        <Row>
                            {/* need to figure this out */}
                            {/* {filters.selectedPoliticians.map((pol) => (
                                <Button>{pol}</Button>
                            ))} */}
                        </Row>
                    </Container>
                </Stack>
            </Col>
            <Col>
                <div className='sankey-diagram'>
                    {/* <SankeyChart /> */}
                    {filters.selectedPoliticians.map((id) => (
                        <SankeyChart cid={id}/>
                    ))}
                    {/* <SankeyChart cid="N00007360"/> */}

                </div>
            </Col>
        </Row>
    </Container>
    );
}

export default SankeyPage;
