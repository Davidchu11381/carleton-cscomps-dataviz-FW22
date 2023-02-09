import React from 'react'
import { Col, Row, Container, Stack, Form, Card, Button, Dropdown } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer, useState } from 'react';
import PoliticianButton from './components/PoliticianButton';
import StateButton from './components/StateButton';
import style from "./index.module.css"

import { reducer, initialState } from './hooks/reducer';

// TALK ABOUT IN COMPS TOMORROW
// when click on the line between fields == info?
// illustrates backing of politicians (aka lobbying)

// need "space" for already-selected politicians
// states may be a drop-down selection (just to be easier)
// GOAL: focus on connecting filtering with data viz

function SankeyPage() {

    const [filters, dispatch] = useReducer(reducer, initialState);
    const allPoliticians = new Map(); 
    const [senators, setSenators] = useState(null);
    const [representatives, setRepresentatives] = useState(null);   

    const stateList = ['Alabama','Alaska','Arizona','Arkansas',
        'California','Colorado','Connecticut','Delaware','Florida',
        'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
        'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
        'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
        'Nevada','New Hampshire','New Jersey','New Mexico','New York',
        'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
        'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
        'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    
    function displayButtons() {
        if (filters.filteredPoliticians.length === 0) {
            return(filters.originalPolList.map(person => 
            <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        } else {
            return (filters.filteredPoliticians.map(person => 
            <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        };
    }

    function displayCoolButtons() {
        var buttonArray = [ ...filters.selectedPoliticians.values() ];
        return(buttonArray.map(person => 
            <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={true}></PoliticianButton>));
    }

    // /**
    //  * Filter array items based on search criteria (query)
    //  */
    function filterItems(arr, query) {
        return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }

    const handleFilter = (event) => {        
        var eligibleStates = filterItems(stateList, event.target.value);

        if (event.code === "Enter") {
            event.target.value = "";
            if (eligibleStates.length === 1) {
                dispatch({
                    type: 'ADD_STATE',
                    value: eligibleStates[0],
                });
                dispatch({
                    type: 'UPDATE_BUTTONS', 
                    party: filters.party,
                    chamber: filters.party,
                    selectedStates: filters.selectedStates,
                });
            };
        };
    };

    useEffect(() => {
        console.log("ins index.js:", filters);
    }, [filters]);

    // useEffect(() => {
    //     fetch('http://137.22.4.60:5001/senators/total') 
    // 	.then(response => response.json())
    // 	.then(data => {
    // 		console.log("all of the senators:", data);
    //         // data.forEach(thing => console.log(thing));
    //         setSenators(data);
    // 	});

    //     fetch('http://137.22.4.60:5001/representatives/total') 
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log("all of the representatives:", data);
    //       setRepresentatives(data);
    //     });

    //     console.log(senators, representatives);
    // }, []);
   
    return (
    <Container>
        <Row>
            <Col lg={4}>
                <Stack gap={2}>
                    <div></div>
                    <h4>Filter below:</h4>
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
                           
                        {/* <Dropdown drop='end'>
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
                        </Dropdown>  */}

                        {/* state type bar */}
                            <Form.Control 
                                size="sm" 
                                type="text" 
                                placeholder="State" 
                                class="mb-3"
                                // onChange={handleFilter}
                                onKeyDown={handleFilter}
                                />
                            <div className="selectedStateListing">
                            {/* need to designate some space for it */}
                                {filters.selectedStates.map((state) => (
                                    <StateButton state={state} filters={filters} func={dispatch}></StateButton>
                                ))}
                            </div>
                        </Col>
                    </Row>
                    <Container>
                        <Row sm={3} md={3} lg={3} className={style.stuffyButtons}>
                            {displayButtons()}
                        </Row>
                    </Container>
                    <Container>
                        <Row sm={2} md={2} lg={3}>
                            {displayCoolButtons()}
                        </Row>
                    </Container>
                </Stack>
            </Col>
            <Col>
                <div className='sankey-diagram'>
                <h1>DATA VIZ STUFF GOES HERE</h1>
                    {/* <SankeyChart cid={id}/> */}
                    {[ ...filters.selectedPoliticians.values() ].map((id) => (
                        <p>{id.name}'s stuff goes here</p>
                    ))}
                </div>
            </Col>
        </Row>
    </Container>
    );
}

export default SankeyPage;
