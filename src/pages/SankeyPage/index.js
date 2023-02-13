import React from 'react'
import { Col, Row, Container, Stack, Form } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer, useState, useRef } from 'react';
import PoliticianButton from './components/PoliticianButton';
import StateButton from './components/StateButton';
import GroupSelectionButton from './components/GroupSelectionButton';
import style from "./index.module.css"

import { reducer, initialState } from './hooks/reducer';

// TALK ABOUT IN COMPS TOMORROW
// when click on the line between fields == info?
// illustrates backing of politicians (aka lobbying)

// need "space" for already-selected politicians
// states may be a drop-down selection (just to be easier)
// GOAL: focus on connecting filtering with data viz

function SankeyPage() {

    /*
    create a button that says select all ()
    for the overall groups, make it easy to see
        who's in the preset groups
    
    IDEAS:
     - have a variable that correlates to a certain group based on selection
      (maybe add different types to reducer based on selection)

    NEXT STEPS:
     - create a map of id -> summary info
     - redesign the filtering system so that it's just pre-selections
        per state, chamber, party
     - ^^^ have the variable / buttons on there
    */

    const [filters, dispatch] = useReducer(reducer, initialState);
    const allPoliticians = new Map(); 
    const [senators, setSenators] = useState(null);
    const [representatives, setRepresentatives] = useState(null);  
    const fetchDelay = [];
    const addIds = [];
    const apiCallCount = useRef(0);

    const stateList = ['Alabama','Alaska','Arizona','Arkansas',
        'California','Colorado','Connecticut','Delaware','Florida',
        'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
        'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
        'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
        'Nevada','New Hampshire','New Jersey','New Mexico','New York',
        'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
        'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
        'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

    const stateAbbrv = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
    
    function displayButtons() {

        if (filters.polList.size !== 0) {
            var buttonArray = [ ...filters.polList.entries() ];
            return (buttonArray.map(person => 
            <PoliticianButton politician={{name: person[1].name, id: person[0]}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        }

        // if (filters.filteredPoliticians.length === 0) {
        //     return(filters.originalPolList.map(person => 
        //     <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        // } else {
        //     return (filters.filteredPoliticians.map(person => 
        //     <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        // };
    }

    function displayCoolButtons() {
        var buttonArray = [ ...filters.selectedPoliticians.values() ];
        return(buttonArray.map(person => 
            <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={true}></PoliticianButton>));
    }

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

    // collecting the politician ids
    useEffect(() => {
        // console.log("IN STEP 1 - BEFORE THE FIRST API CALL");
        
        // STEP 1
        fetch('http://137.22.4.60:5001/senators/total') 
    	.then(response => response.json())
    	.then(data => {
            setSenators(data);
    	});

        fetch('http://137.22.4.60:5001/representatives/total') 
        .then(response => response.json())
        .then(data => {
          setRepresentatives(data);
        });

        apiCallCount.current = 1;
        fetchDelay.push("done");
        // console.log("IN STEP 1 - CHANGED USESTATE OF THE TWO CHAMBERS");

    }, []);

    useEffect(() => {
        // console.log("IN STEP 2 - BEFORE THE IF STATEMENT");

        // STEP 2
        if (senators !== null && representatives !== null && apiCallCount.current === 1) {
            // console.log("IN STEP 2 - INSIDE THE IF STATEMENT");

            // senators first
            senators.data.map((id) => {
                allPoliticians.set(id, "");
            });
            // next representatives
            representatives.data.map((id) => {
                allPoliticians.set(id, "");
            });
            addIds.push("hello");
            apiCallCount.current = 2;
            // console.log("IN STEP 2 - DONE WITH THE OPERATION");
        }

        // console.log("IN STEP 2 - AFTER THE IF STATEMENT");

    }, [fetchDelay]);

    useEffect(() => {
        // console.log("IN STEP 3 - BEFORE THE IF STATEMENT");

        // STEP 3
        if (addIds !== [] && apiCallCount.current === 2 && allPoliticians.size > 0) {
            // console.log("IN STEP 3 - BEFORE THE API CALL");
            allPoliticians.forEach((value, key) => {
                fetch('http://137.22.4.60:5001/' + key + '/summary')
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    allPoliticians.set(key, {
                        name: data.summary.full_name,
                        party: data.summary.party,
                        chamber: data.summary.type,
                        state: data.summary.state,
                        id: data.summary.opensecrets_id,
                    });
                });
            });
            apiCallCount.current = 3;
            filters.polList = allPoliticians; 
            // console.log("IN STEP 3 - AT THE END OF THE OPERATION");
        };
        // console.log("IN STEP 3 - AFTER THE IF STATEMENT");
        
    }, [addIds]);

    useEffect(() => {
        console.log("ins index.js:", filters);
    }, [filters]);
   
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
                            {/* {filters.polList.forEach((value, key) => displayButtons(key, value))} */}
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
                {/* <div className='sankey-diagram'>
                <h1>DATA VIZ STUFF GOES HERE</h1>
                    <SankeyChart cid={id}/>
                    {[ ...filters.selectedPoliticians.values() ].map((id) => (
                        <p>{id.name}'s stuff goes here</p>
                    ))}
                </div> */}
                <div>
                <h1>Filter by the group selections below</h1>
                <Row lg={2}>
                    <Col>
                        <h3>By Chamber</h3>
                            <GroupSelectionButton type="Senate" func={dispatch}></GroupSelectionButton>
                            <GroupSelectionButton type="House" func={dispatch}></GroupSelectionButton>
                    </Col>
                    <Col>
                        <h3>By Party</h3>
                        <GroupSelectionButton type="Republican" func={dispatch}></GroupSelectionButton>
                        <GroupSelectionButton type="Democrat" func={dispatch}></GroupSelectionButton>
                        <GroupSelectionButton type="Other" func={dispatch}></GroupSelectionButton>
                    </Col>
                </Row>
                <Row lg={5}>
                    <h3>By State</h3>
                    {/* do it by state codes */}
                </Row>
                
                
                </div>
            </Col>
        </Row>
    </Container>
    );
}

export default SankeyPage;
