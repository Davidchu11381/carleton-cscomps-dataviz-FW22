import React from 'react'
import { Col, Row, Container, Stack, ButtonGroup } from 'react-bootstrap'
import { Form, ToggleButton } from 'react-bootstrap'
import SankeyChart from '../HomePage/components/SankeyChart';
import { useState, useEffect, useReducer } from 'react';
import PoliticianButton from './components/PoliticianButton';

import { reducer, initialState } from './hooks/reducer';

function SankeyPage() {

    const [filters, setFilters] = useState({
        party: "",
        chamber: "",
        state: []
    });

    const [something, dispatch] = useReducer(reducer, initialState);

    const [checked, setChecked] = useState(false);

    var stateList = ["Alabama", "Alaska", "Arizona"];

    // responds to after the enter key was pressed
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          console.log(event.target.value);
        //   setFilters({ ... filters, state: state.push("hello")});
        }
    }

    // const fruits = ["apple", "banana", "grapes", "mango", "orange"];

    // /**
    //  * Filter array items based on search criteria (query)
    //  */
    function filterItems(arr, query) {
    return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }

    // function selections () {
    //     // return this.state.deps.filter(dep => dep.DepartmentName.length > 6).map(dep =>
    //     //     <option key={dep.DepartmentID}>{dep.DepartmentName}</option>
    //     // ); 
    //     return stateList.map(dep =>
    //         <option key={dep}>{dep}</option>
    //     ); 
    // }

    // console.log(filterItems(fruits, "ap")); // ['apple', 'grapes']
    // console.log(filterItems(fruits, "an")); // ['banana', 'mango', 'orange']

    const handleFilter = (event) => {        
        var eligibleStates = filterItems(stateList, event.target.value);
        console.log(eligibleStates);
        // return stateList.map(dep =>
        //     <option key={dep}>{dep}</option>
        // ); 
        // need to form a "list group under the search that contains the list of states..."
    }

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    useEffect(() => {
        console.log(something);
    }, [something]);


    // create a reducer so that selected states / politicians are easier to manage
    
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
                                    //     setFilters( prevFilters => { return { ...prevFilters, chamber: ""}
                                    // })
                                        dispatch({
                                                type: 'UPDATE_CHAMBER',
                                                value: "",
                                            });	
                                    } else {
                                    //     setFilters( prevFilters => { return { ...prevFilters, chamber: event.target.value}
                                    // })
                                        dispatch({
                                                type: 'UPDATE_CHAMBER',
                                                value: event.target.value,
                                            });	
                                    };
                                }}>
                                <option>Chamber</option>
                                <option value="house">House of Representatives</option>
                                <option value="senate">Senate</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row lg={1}>
                        <Col>
                            <Form.Control 
                                size="sm" 
                                type="text" 
                                placeholder="Old State" 
                                class="mb-3"
                                onKeyDown={handleFilter}
                                />
                        </Col>
                        <Col>                        
                            {/* <Form.Control as = 'select'>
                                {selections()}
                            </Form.Control> */}
                        </Col>
                        
                        {/* <Col>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary">Left</Button>
                                <Button variant="secondary">Middle</Button>
                                <Button variant="secondary">Right</Button>
                            </ButtonGroup>
                        </Col> */}
                        <Col>
                            
                        </Col>
                    </Row>

                    {/* where the array of politicians will be listed */}
                    <Container>
                    <ToggleButton
                        className="mb-2"
                        id="politician-id"
                        type="checkbox"
                        variant="outline-primary"
                        checked={checked}
                        value="1"
                        onChange={(e) => {
                            console.log(e.currentTarget.id);
                            setChecked(e.currentTarget.checked);

                        }}
                        // console.log(e);
                        // setChecked(e.currentTarget.checked)}
                    >
                        Politician Name
                    </ToggleButton>

                    </Container>

                    {/* <Form.Select aria-label="state-select"
                        size="sm"
                        id="state"
                        onChange={(event) => {
                            console.log(event.target.value);
                            if (event.target.value === "State") {
                               setFilters( prevFilters => { return { ...prevFilters, state: ""}
                            })} else {
                                setFilters( prevFilters => { return { ...prevFilters, state: event.target.value}
                            })};
                        }}>
                        <option>State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                    </Form.Select> */}
                    <Container>
                        {/* listing of the congresspoeple that fit the criteria go here */}
                        <PoliticianButton
                        politician={{id: "example", name: "Nancy"}}>

                        </PoliticianButton>
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
