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

    const [filters, dispatch] = useReducer(reducer, initialState);
    const allPoliticians = new Map(); 
    const [senators, setSenators] = useState(null);
    const [representatives, setRepresentatives] = useState(null);  
    const fetchDelay = [];
    const addIds = [];
    const apiCallCount = useRef(0);
    const [isLoading, setLoading] = useState(false);
    const [dataThere, setDataThere] = useState(false);

    // to load sankey charts
    const cid_map2 = new Map();
    cid_map2.set("N00003389", "Jane Smith");
    cid_map2.set("N00007360", "John Doe");

    const stateAbbrv = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

    function displaySankey() {
        if (filters.selectedPoliticians.size !== 0) {
            let data = new Map();
            filters.selectedPoliticians.forEach((el) => {
                data.set(el.id, el.name);
            });
            setDataThere(true);

            dispatch({
                type: 'DISPLAY_SANKEY',
                value: data,
                buttonState: true,
            })            
        }
    }

    useEffect(() => {
        console.log("done loading everything")
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
            buttonList.push(<PoliticianButton politician={{name: pol[1].name, id: pol[0]}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>);
        })
        return buttonList;
    }

    function theSelectedButtons() {
        let list = [ ...filters.selectedPoliticians ];
        let buttonList = [];
        list.map((pol) => {
            buttonList.push(<PoliticianButton politician={{name: pol[1].name, id: pol[0]}} reduc={{data: filters, func: dispatch}} state={true}></PoliticianButton>);
        })
        return buttonList;
    }

    const displayButtons = () => {
        dispatch({
            type: 'DISPLAY_BUTTONS',
            value: "",
        })
    }

    // collecting the politician ids
    useEffect(() => {
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
    }, []);

    useEffect(() => {
        // STEP 2
        if (senators !== null && representatives !== null && apiCallCount.current === 1) {
            senators.data.split(',').map((id) => {
                allPoliticians.set(id, "");
            });
            representatives.data.split(",").map((id) => {
                allPoliticians.set(id, "");
            });
            addIds.push("hello");
            apiCallCount.current = 2;
        }
    }, [fetchDelay]);

    useEffect(() => {
        // STEP 3
        if (addIds !== [] && apiCallCount.current === 2 && allPoliticians.size > 0) {
            allPoliticians.forEach((value, key) => {
                fetch('http://137.22.4.60:5001/' + key + '/summary')
                .then(response => response.json())
                .then(data => {
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
        };        
    }, [addIds]);

    useEffect(() => {
        console.log("ins index.js:", filters);
    }, [filters]);
   
    return (
    <Container>

        <Row md={2} lg={2}>
            <Col lg={5}>
                <Stack gap={1}>
                    <div className="pt-3 h3">Overview</div>
                    <p className="lead mb-1">
                        You can filter by chamber, party or state to see sankey diagrams
                        of politicians with the selected features. 
                    </p>
                    <Row>
                    <div className="pt-3 h4">By Chamber</div>
                        <Row lg={3}>
                            <GroupSelectionButton type="chamber" id="sen" value="Senate" func={dispatch}></GroupSelectionButton>
                            <GroupSelectionButton type="chamber" id="rep" value="House" func={dispatch}></GroupSelectionButton>
                        </Row>
                    </Row>
                    <Row>
                    <div className="pt-3 h4">By Party</div>
                        <Row lg={4}>
                            <GroupSelectionButton type="party" id="Republican" value="Republican" func={dispatch}></GroupSelectionButton>
                            <GroupSelectionButton type="party" id="Democrat" value="Democrat" func={dispatch}></GroupSelectionButton>
                            <GroupSelectionButton type="party" id="Independent" value="Independent" func={dispatch}></GroupSelectionButton>
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
                        <Button className="mb-4 mt-4"
                            onClick={displayButtons}
                        >
                            Filter
                        </Button>
                </Stack>
            </Col>
            <Col>
                <Row lg={2}>

                    {/* filtered politcians */}
                    <Col>
                        <div className="pt-3 h4">Filtered Politicians</div>
                        {theFilteredButtons()}
                    </Col>
                    <Col>
                        {/* selected politicians */}
                        <div className="pt-3 h4">Selected Politicians</div>
                        {theSelectedButtons()}
                    </Col>
                </Row>
                <Row>
                    <Button
                        onClick={
                            !isLoading? loading : null}
                        disabled={isLoading}
                        >
                        {isLoading? 'Loading...' : 'Display Sankey'}
                    </Button>
                </Row>
                <Row>
                    {/* {[ ...filters.selectedPoliticians ].map((el) => { 
                        console.log("the different politicians:", el);
                        let haha = new Map();
                        haha.set(el.id, el.name); 
                        console.log("inside loop = this is the given data:", haha);                     
                        return <SankeyChart cid_map={haha}/>
                    })} */}
                    {filters.sankeyReady? <SankeyChart cid_map={filters.displayPoli}/> : null}
                </Row>                
            </Col>
        </Row>
        {/* <div className={style.hide}>
            <SankeyChart cid_map={cid_map2}/>
        </div> */}
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
