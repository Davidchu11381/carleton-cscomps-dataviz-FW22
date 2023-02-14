import React from 'react'
import { Col, Row, Container, Stack, Form, DropdownButton, Card, Button } from 'react-bootstrap'
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

    // const [example, setExample] = useState(style.hide);

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

    function displaySankey() {
        if (filters.groupSelected.size !== 0) {
            // note : only works with republican / democrat selection
            var types = [ ...filters.groupSelected.keys() ];
            return (types.map(type => <SankeyChart group={type}/>))
        }
    }

    function displayButtons() {
        if (filters.polList.size !== 0) {
            var buttonArray = [ ...filters.polList.entries() ];
            return (buttonArray.map(person => 
            <PoliticianButton politician={{name: person[1].name, id: person[0]}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
        }
    }

    function displayCoolButtons() {
        var buttonArray = [ ...filters.selectedPoliticians.values() ];
        return(buttonArray.map(person => 
            <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={true}></PoliticianButton>));
    }

    function doThis() {
        return (
            <Card>
                <Card.Body>This is some text within a card body.</Card.Body>
                <Row lg={4} md={4}>
                    {displayButtons()}
                </Row>
            </Card>
        )
    }

    function filterItems(arr, query) {
        return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }

    const updateStateList = (event) => {
        if (event.target.checked) {
            dispatch({
                type: 'ADD_STATE',
                value: event.target.id,
            })
        } else {
            dispatch({
                type: 'REMOVE_STATE',
                value: event.target.id,
            })
        }
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
            senators.data.split(',').map((id) => {
                allPoliticians.set(id, "");
            });
            // next representatives
            representatives.data.split(",").map((id) => {
                allPoliticians.set(id, "");
            });
            addIds.push("hello");
            apiCallCount.current = 2;

            console.log(allPoliticians);
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
                console.log(key);
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

        <Row md={2} lg={2}>
            <Col lg={4}>
                <Stack gap={1}>

                <div className="pt-3 h3">Overview</div>
                <p className="lead mb-1">
                    You can filter by chamber, party or state to see sankey diagrams
                    of politicians with the selected features. 
                </p>
                <Row>
                <div className="pt-3 h4">By Chamber</div>
                    <Row lg={3}>
                        <GroupSelectionButton type="Senate" func={dispatch}></GroupSelectionButton>
                        <GroupSelectionButton type="House" func={dispatch}></GroupSelectionButton>
                    </Row>
                </Row>
                <Row>
                <div className="pt-3 h4">By Party</div>
                    <Row lg={4}>
                    <GroupSelectionButton type="Republican" func={dispatch}></GroupSelectionButton>
                    <GroupSelectionButton type="Democrat" func={dispatch}></GroupSelectionButton>
                    <GroupSelectionButton type="Other" func={dispatch}></GroupSelectionButton>
                    </Row>
                </Row>
                <Row>
                    
                <div className="pt-3 h4">By State</div>
                    {/* create a dropdown for the states and a variable for selected ones */}
                    <Row lg={8} md={6}>
                        {stateAbbrv.map(state => {
                            return (<StateButton state={state} filters={filters} func={dispatch}></StateButton>)
                        })}
                    </Row>
                </Row>
                <Button className="mb-4 mt-4">
                    Filter
                </Button>
                </Stack>
            </Col>


        </Row>
        {/* {displayCoolButtons()} */}
        
        <Row>
        {/* sankey diagrams will go here */}
        
        </Row>
    </Container>
    );
}

export default SankeyPage;
