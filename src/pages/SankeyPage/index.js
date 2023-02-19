import React from 'react'
import { Col, Row, Container, Stack, Form, DropdownButton, Button, Accordion } from 'react-bootstrap'
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

    const [filters, dispatch] = useReducer(reducer, initialState);
    const allPoliticians = new Map(); 
    const [allData, setAllData] = useState(null);
    const fetchDelay = [];
    const apiCallCount = useRef(0);
    const [isLoading, setLoading] = useState(false);

    const stateAbbrv = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

    function displaySankey() {
        if (filters.selectedPoliticians.size !== 0) {
            let data = new Map();
            filters.selectedPoliticians.forEach((el) => {
                data.set(el.id, el.full_name);
            });
            dispatch({
                type: 'DISPLAY_SANKEY',
                value: data,
                buttonState: true,
            })            
        }
    }

    useEffect(() => {
        if (isLoading) {
            displaySankey();
            setLoading(false);
        }
    }, [isLoading]);

    const loading = () => setLoading(true);

    function theFilteredButtons() {
        let list = [ ...filters.filteredPoliticians ];
        let buttonList = [];
        list.map((pol) => {
            buttonList.push(<PoliticianButton politician={{name: pol[1].full_name, id: pol[0], party: pol[1].party}} func={dispatch} state={true}></PoliticianButton>);
        })
        return buttonList;
    }

    const displayButtons = () => {
        dispatch({
            type: 'DISPLAY_BUTTONS',
            value: "",
        })
    }

    const clearFilter = () => {
        dispatch({
            type: 'CLEAR_FILTER',
            value: "",
        })
    }

    // collecting data for politicians needed for filtering
    useEffect(() => {
        fetch('http://137.22.4.60:5001/cid_to_summary')
        .then(response => response.json())
        .then(data => {
            setAllData(data.data);
        })
        apiCallCount.current = 1;
        fetchDelay.push("done");
    }, []);

    useEffect(() => {
        if (apiCallCount.current === 1 && allData !== null) {
            for (var poli in allData) {
                allPoliticians.set(poli, allData[poli]);
            }
            filters.polList = allPoliticians;
        }
    }, [fetchDelay]);

    useEffect(() => {
        console.log("ins index.js:", filters, filters.selectedPoliticians.size);
    }, [filters]);
   
    return (
    <Container>
        {/* the top w text */}
        <Row>
            {/* <div className="pt-3 h3">Overview</div> */}
            <p className="pt-3 h3">What is MoneyFlow?</p>
            <p className="lead">
                MoneyFlow is a web application that lets you explore the relationships between funding sources and speech
                for members of congress. We have gathered data on funding broken down by industry, statements made on the floor
                of congress, and tweets for each politician. We then performed topic modeling on the statements and tweets
                to gather quantitative data about what topics politicians speek about.
            </p>
            <p className="pt-3 h5">How is the data represented?</p>
            <div className="pt-3 mb-3 pb-3 lead">
                <p>You can explore these relationships through Sankey diagrams, which show the flows of money
                to congresspeople and congresspeople to topics.</p>
                <p>If you'd like to learn more about the data that's being represented, head to <a href="/data">the page about the data collection</a>.
                </p>
            <div className={style.line}></div>
            </div>
            <p className="lead mb-1">
                Filter by chamber, party or state to see sankey diagrams
                of politicians with the selected features. 
            </p>
        </Row>
        <Row lg={2} md={2}>
            {/* the filtering system */}        
            <Col>
                <Stack gap={1}>
                    <Row lg={2} md={2}>
                        <Col>
                            <div className="pt-3 h5">By Chamber</div>
                            <Row lg={1} md={1}>
                                <GroupSelectionButton type="chamber" id="sen" value="Senate" func={dispatch}></GroupSelectionButton>
                                <GroupSelectionButton type="chamber" id="rep" value="House" func={dispatch}></GroupSelectionButton>
                            </Row>
                        </Col>
                        <Col>
                            <div className="pt-3 h5">By Party</div>
                            <Row lg={1} md={1}>
                                <GroupSelectionButton type="party" id="Republican" value="Republican" func={dispatch}></GroupSelectionButton>
                                <GroupSelectionButton type="party" id="Democrat" value="Democrat" func={dispatch}></GroupSelectionButton>
                                <GroupSelectionButton type="party" id="Independent" value="Independent" func={dispatch}></GroupSelectionButton>
                            </Row>
                        </Col>
                    </Row>
                </Stack>
            </Col>
            <Col>
                <div className="pt-3 h5">By State</div>
                {/* create a dropdown for the states and a variable for selected ones */}
                {/* <Row lg={8} md={6}> */}
                {/* <Row lg={1} md={1}> */}
                    {/* <Accordion>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>States</Accordion.Header>
                        <Accordion.Body> */}
                    {stateAbbrv.map(state => {
                        return (<StateButton state={state} filters={filters} func={dispatch}></StateButton>)
                    })}
                        {/* </Accordion.Body>
                    </Accordion.Item>
                    </Accordion> */}
                {/* </Row> */}
            </Col>
        </Row>
        <Row>
        {/* <Row lg={2}>
            <Col>
                <Button
                    onClick={clearFilter}>
                        Clear
                    </Button>
            </Col> */}
            {/* <Col> */}
                <Button className="mb-4 mt-4"
                        onClick={displayButtons}
                    >
                        Filter
                    </Button>
            {/* </Col> */}
        </Row>
        <Row>
            <Col lg={4}>
                <p className="lead">Politicians Based on Filtering</p>
            </Col>
            {/* listing of politcian buttons */}
            <div className={style.buttonListing}>
            {/* this will prob be in a box so that we can keep them "contained somehow" */}
            <Col lg>
                <Row lg={5} md={4}>
                    {theFilteredButtons()}
                </Row>
            </Col></div>
        </Row>
        <Row>
            <Col>
                <Button
                    onClick={
                        !isLoading? loading : null}
                    disabled={isLoading}
                    >
                    {isLoading? 'Loading...' : 'Display Information'}
                </Button>
            </Col>
        </Row>
        <Row>
            {filters.sankeyReady? <SankeyChart cid_map={filters.displayPoli}/> : null}
        </Row>
        <Row className="pt-3 h3">
            this is just some random text...
        </Row>
        {/* need to hide this until display sankey is displayed */}
        {/* <Row>
            <Button>
                Back to Top
            </Button>
        </Row> */}

            {/* {[ ...filters.selectedPoliticians ].map((el) => { 
                console.log("the different politicians:", el);
                let haha = new Map();
                haha.set(el.id, el.name); 
                console.log("inside loop = this is the given data:", haha);                     
                return <SankeyChart cid_map={haha}/>
            })} */}
    </Container>
    );
}

export default SankeyPage;


// OLD CODE

// function filterItems(arr, query) {
//     return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
// }

// const updateStateList = (event) => {
//     if (event.target.checked) {
//         dispatch({
//             type: 'ADD_STATE',
//             value: event.target.id,
//         })
//     } else {
//         dispatch({
//             type: 'REMOVE_STATE',
//             value: event.target.id,
//         })
//     }
// }

// const handleFilter = (event) => {        
//     var eligibleStates = filterItems(stateList, event.target.value);

//     if (event.code === "Enter") {
//         event.target.value = "";
//         if (eligibleStates.length === 1) {
//             dispatch({
//                 type: 'ADD_STATE',
//                 value: eligibleStates[0],
//             });
//             dispatch({
//                 type: 'UPDATE_BUTTONS', 
//                 party: filters.party,
//                 chamber: filters.party,
//                 selectedStates: filters.selectedStates,
//             });
//         };
//     };
// };


// const stateList = ['Alabama','Alaska','Arizona','Arkansas',
//     'California','Colorado','Connecticut','Delaware','Florida',
//     'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
//     'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
//     'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska',
//     'Nevada','New Hampshire','New Jersey','New Mexico','New York',
//     'North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
//     'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
//     'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
