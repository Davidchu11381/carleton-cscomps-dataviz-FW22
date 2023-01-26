import React from 'react'
import { Col, Row, Container, Stack, Form, Card, ListGroupItem } from 'react-bootstrap'
import { ButtonGroup, ToggleButton, ListGroup } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer } from 'react';
import PoliticianButton from './components/PoliticianButton';

import { reducer, initialState } from './hooks/reducer';

// TALK ABOUT IN COMPS TOMORROW
// when click on the line between fields == info?
// illustrates backing of politicians (aka lobbying)

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

    // politician={{id: "Pelosi", name: "Nancy Pelosi", func: dispatch}}>

    const personTest = [{id: "Pelosi", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
                        {id: "McConnell", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
                        {id: "Boozman", name: "John Boozman", party: "Republican", chamber: "Senate", state: "Arkansas"},
                        {id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
                        {id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"}]


    // /**
    //  * Filter array items based on search criteria (query)
    //  */
    function filterItems(arr, query) {
        return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }

    function listStates(list) {
        return list.map(state => 
            <ListGroupItem> {state} </ListGroupItem>)
    }

    const handleFilter = (event) => {        
        var eligibleStates = filterItems(stateList, event.target.value);
        console.log(eligibleStates);
        // return stateList.map(dep =>
        //     <option key={dep}>{dep}</option>
        // ); 
        // need to form a "list group under the search that contains the list of states..."
    }

    // useEffect(() => {
    //     listStates(filters.selectedStates);
    // }, [filters.selectedStates])

    useEffect(() => {
        console.log("in index.js:", filters);
        // this is where the list of eligable congrespeople need to change
    }, [filters]);
   
    return (
    <Container>
        <Row>
            <Col lg={4}>
                <Stack gap={2}>
                    <h2>Filter by things below</h2>
                    <Row lg={2}>
                        <Col>
                            <Form.Select aria-label="party-select" 
                                size="sm"
                                id="party"
                                onChange={(event) => {
                                    console.log(event.target.value);
                                    if (event.target.value === "Party") {
                                        dispatch({
                                            type: 'UPDATE_PARTY',
                                            value: "",
                                        });	

                                    // setFilters( prevFilters => { return { ...prevFilters, party: ""}
                                    } else {
                                        dispatch({
                                            type: 'UPDATE_PARTY',
                                            value: event.target.value,
                                        });	
                                        // setFilters( prevFilters => { return { ...prevFilters, party: event.target.value}
                                    }
                                }}>
                                <option>Party</option>
                                <option value="democratic">Democrat</option>
                                <option value="republican">Republican</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Select aria-label="chamber-select"
                                size="sm"
                                id="chamber"
                                onChange={(event) => {
                                    console.log(event.target.value);
                                    if (event.target.value === "Chamber") { 
                                        dispatch({
                                                type: 'UPDATE_CHAMBER',
                                                value: "",
                                            });	
                                    } else {
                                        dispatch({
                                                type: 'UPDATE_CHAMBER',
                                                value: event.target.value,
                                            });	
                                    };
                                }}>
                                <option>Chamber</option>
                                <option value="house">House of Representatives</option>
                                <option value="senate">United States Senate</option>
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
                                <ListGroup>
                                    {/* {listStates(filters.selectedStates)} */}
                                    {/* <ListGroup.Item size="sm">Cras justo odio</ListGroup.Item>
                                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item> */}
                                </ListGroup>
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
                        {personTest.map(person => 
                            <PoliticianButton politician={person} func={dispatch}></PoliticianButton>)}
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
