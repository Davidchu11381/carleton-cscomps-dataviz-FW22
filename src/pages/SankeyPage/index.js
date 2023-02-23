import React from 'react'
import { Col, Row, Container, Stack, Button } from 'react-bootstrap'
// import { useNavigate } from 'react-router';
import SankeyChart from '../HomePage/components/SankeyChart';
import { useEffect, useReducer, useState, useRef } from 'react';
import PoliticianButton from './components/PoliticianButton';
import StateButton from './components/StateButton';
import GroupSelectionButton from './components/GroupSelectionButton';
import style from "./index.module.css"

import { reducer, initialState } from './hooks/reducer';

import { compReducer, compInitialState } from './components/hooks/reducer';


// TALK ABOUT IN COMPS TOMORROW
// when click on the line between fields == info?
// illustrates backing of politicians (aka lobbying)

// need "space" for already-selected politicians
// states may be a drop-down selection (just to be easier)
// GOAL: focus on connecting filtering with data viz

function SankeyPage() {

    const [filters, dispatch] = useReducer(reducer, initialState);
    const [compStuff, compDispatch] = useReducer(compReducer, compInitialState);
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
            buttonList.push(
            // <div className={style.poliButtonSpacing}>
            <PoliticianButton politician={{name: pol[1].full_name, id: pol[0], party: pol[1].party}} func={dispatch} state={true}></PoliticianButton>
            );
            // /* </div> */s
        })
        return buttonList;
    }

    const displayButtons = () => {
        // setWait(false);
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
        compDispatch({
            type: 'CLEAR_EVERYTHING',
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
        console.log("ins index.js:", filters);
        console.log("this is the new displayPoli:", filters.displayPoli);
        console.log("this is the sankeyReady:", filters.sankeyReady);
    }, [filters]);
   
    return (
    <Container>
        <p className="pt-3 mb-3 h3">What is FollowTheMoney?</p>
        <p className="lead">
        FollowTheMoney is a web application that lets you explore the relationships between funding sources and speech
        for members of Congress. We have gathered data on funding broken down by industry, statements made on the floor
        of Congress, and tweets for each politician. We then performed topic modeling on the statements and tweets
        to gather quantitative data about what topics politicians speak about.
        </p>

        <p className="lead">You can explore these relationships through Sankey diagrams, which show the flows of money
        to congresspeople and congresspeople to topics.</p>

        <p className="lead mb-4">If you'd like to learn more about the data that's being represented, head to <a href="/data">our data collection page</a>.
        </p>
        <p className="mt-4 mb-3 h5"> <strong>Try Out the Filter Below </strong></p>
        <p className="lead mb-2">
                First, <strong>filter</strong> for the chamber(s), party(s) and/or state(s) that you are interested in.
        </p> 
        <p className="lead mb-2">
                If you wish to edit your group of politicians, simply click on their names from the box on the right, 
                and they will disappear. If you wish to clear the entire group, click <strong>Clear Selection</strong>.
        </p>
        <p className="lead mb-4">
            Finally, once you are satisfied with your group of politicians, click on the <strong>Display Information </strong>
            to see the resulting Sankey Diagrams.
        </p>
        <p>
                <strong>Note:</strong> If more than 10 politicians are selected, the representation of the data becomes
                quite convulated and can be confusing to interpret.
        </p>
        <a id="filter_system"></a>
        {/* the top w text */}
        <br></br>
        <Row>
        <Col>
        {/* <Row lg={2} md={2}> */}
            {/* the filtering system */}        
            {/* <Col> */}
                <Stack gap={1}>
                    <Row lg={2} md={2}>
                        <Col>
                            <div className="pt-3 h5">By Chamber</div>
                            <div className={style.buttonSpace}>
                                <Row lg={1} md={1}>
                                    <GroupSelectionButton type="chamber" id="sen" value="Senate" func={dispatch}></GroupSelectionButton>
                                    <GroupSelectionButton type="chamber" id="rep" value="House" func={dispatch}></GroupSelectionButton>
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            <div className="pt-3 h5">By Party</div>
                            {/* <div className={style.buttonSpace}> */}
                                <Row lg={1} md={1}>
                                    <GroupSelectionButton type="party" id="Republican" value="Republican" func={dispatch}></GroupSelectionButton>
                                    <GroupSelectionButton type="party" id="Democrat" value="Democrat" func={dispatch}></GroupSelectionButton>
                                    <GroupSelectionButton type="party" id="Independent" value="Independent" func={dispatch}></GroupSelectionButton>
                                </Row>
                            {/* </div> */}
                        </Col>
                    </Row>
                </Stack>
            {/* </Col>
        </Row> */}
        <Row>
            <Col>
                <div className="pt-3 h5">By State</div>
                    {stateAbbrv.map(state => {
                        return (<StateButton state={state} filters={filters} func={dispatch}></StateButton>)
                    })}
            </Col>
        </Row>
        <Row>

        </Row>
        </Col>
        <Col className="ms-4">
        <div className={style.buttonSection}>
           
            <div>
                <Row>
                <p className="m-3 h5">Politicians Based on Filtering</p>
                </Row>
                {/* listing of politcian buttons */}
                <Row>
                    <div className={style.buttonListing}>
                        {/* <Col lg> */}
                            {/* <div className={style.poliButtonSpacing}> */}
                                <Row lg={5} md={4}>
                                    {theFilteredButtons()}
                                </Row>
                            {/* </div> */}
                        {/* </Col> */}
                    </div>           
                <Button 
                    // className="mb-4 mt-4 ps-5 pe-5" 
                    className="mt-2"
                    onClick={displayButtons}>
                    Filter
                </Button>            
                <Button className="mt-2"
                    variant="danger"
                    onClick={clearFilter}>
                        Clear Selection
                    </Button>
                    {/* <Button>
                        Deselect Politicians
                    </Button> */}
                </Row>
            </div>  

        <Row className="mt-2">
            <Button
                    className="btn-success ps-5 pe-5"
                    // variant="secondary"
                    onClick={
                        !isLoading? loading : null}
                    disabled={isLoading}
                    >
                    {isLoading? 'Loading...' : 'Display Information'}
            </Button>
        </Row>   
        </div>
        </Col>
        </Row>
        
        <Row>
            {filters.sankeyReady? <SankeyChart cid_map={filters.displayPoli}/> : null}
        </Row>
        <div className={style.space}></div>
        <Row>
            {filters.sankeyReady? <Button href="#filter_system">Back to Filter System</Button> : null}
        </Row>
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
