import React from 'react'
import { Col, Row, Container, Stack, Button, ToggleButtonGroup } from 'react-bootstrap'
import SankeyChart from './components/SankeyChart';
import { useEffect, useReducer, useState, useRef } from 'react';
import PoliticianButton from './components/PoliticianButton';
import StateButton from './components/StateButton';
import GroupSelectionButton from './components/GroupSelectionButton';
import style from "./index.module.css"

import { reducer, initialState } from './hooks/reducer';
import { componentReducer, componentInitialState } from './components/hooks/reducer';

function SankeyPage() {

    const [filters, dispatch] = useReducer(reducer, initialState);
    const [compStuff, compDispatch] = useReducer(componentReducer, componentInitialState);
    const allPoliticians = new Map(); 
    const [allData, setAllData] = useState(null);
    const fetchDelay = [];
    const apiCallCount = useRef(0);

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

    function theFilteredButtons() {
        let list = [ ...filters.filteredPoliticians ];
        let buttonList = [];
        list.map((pol) => {
            buttonList.push(
            <PoliticianButton politician={{name: pol[1].full_name, id: pol[0], party: pol[1].party}} func={dispatch} state={true}></PoliticianButton>
            );
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
        compDispatch({
            type: 'CLEAR_EVERYTHING',
            value: "",
        })
    }

    const handleClickScroll = () => {
        displaySankey();
        const element = document.getElementById('charts');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth'});
        }
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
        console.log("in index.js:", filters);
    }, [filters]);
   
    return (
    <Container className="mb-3">
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
        <p className="lead mb-2">
            Finally, once you are satisfied with your group of politicians, click on <strong>Display Visualization(s) Below </strong>
            to see Sankey Diagram(s).
            These diagrams give information on <strong>industry fundings</strong>, and on <strong>political topics</strong> found in <strong>statements</strong>, and <strong> tweets</strong> belonging to the politicians in congress.
        </p>
        <a id="filter_system"></a>
        <br></br>
        <p>
            <strong>Note:</strong> If more than 10 politicians are selected, the representation of the data becomes
            quite convoluted and can be confusing to interpret.
        </p>
        <br></br>
        <div>
            <div>
                <Row>
                    <Col>
                        <Stack gap={1}>
                            <Row lg={2} md={2}>
                                <Col>
                                    <div className="pt-3 h5">By Chamber</div>
                                    <div className={style.buttonSpace}>
                                        <Row>
                                            <ToggleButtonGroup type="checkbox">
                                                <Stack>
                                                    <Row>
                                                    <GroupSelectionButton type="chamber" id="sen" value="Senate" func={dispatch}></GroupSelectionButton>
                                                    </Row><Row>
                                                    <GroupSelectionButton type="chamber" id="rep" value="House" func={dispatch}></GroupSelectionButton>
                                                    </Row>
                                                </Stack>
                                            </ToggleButtonGroup>
                                        </Row>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="pt-3 h5">By Party</div>
                                        <Row>
                                        <ToggleButtonGroup type="checkbox">
                                            <Stack>
                                                <GroupSelectionButton type="party" id="Republican" value="Republican" func={dispatch}></GroupSelectionButton>
                                                <GroupSelectionButton type="party" id="Democrat" value="Democrat" func={dispatch}></GroupSelectionButton>
                                                <GroupSelectionButton type="party" id="Independent" value="Independent" func={dispatch}></GroupSelectionButton>
                                            </Stack>
                                        </ToggleButtonGroup>
                                        </Row>
                                </Col>
                            </Row>
                        </Stack>
                        <Row>
                            <Col>
                                <div className="pt-3 h5">By State</div>
                                    {stateAbbrv.map(state => {
                                        return (<StateButton state={state} filters={filters} func={dispatch}></StateButton>)
                                    })}
                            </Col>
                        </Row>
                    </Col>
                    <Col className="ms-4">
                        <div className={style.buttonSection}>
                            <div>
                                <Row>
                                    <p className="m-3 h5">Politicians Based on Filtering</p>
                                </Row>
                                <Row>
                                    <div className={style.buttonListing}>
                                        <Row lg={5} md={4}>
                                            {theFilteredButtons()}
                                        </Row>
                                    </div>           
                                <Button 
                                    className="mt-2"
                                    onClick={displayButtons}>
                                    Filter
                                </Button>            
                                <Button className="mt-2"
                                    variant="danger"
                                    onClick={clearFilter}>
                                        Clear Selection
                                    </Button>
                                </Row>
                            </div> 
                            <Row className="mt-2 mb-4">
                                    <Button
                                        variant="success"
                                        onClick={handleClickScroll}
                                        npmhref="#sankeys"
                                        >
                                            Display Visualization(s) Below
                                    </Button>
                            </Row>   
                        </div>
                    </Col>
                </Row>
            </div>
            <br></br>
            <br></br>
            <div id="charts">
                <Container className="mt-5">
                    <Row className="mt-5 pt-5">
                        <a id="sankeys"></a>
                        {filters.sankeyReady? <SankeyChart cid_map={filters.displayPoli}/> : null}
                    </Row>
                    <div className={style.space}></div>
                    <Row>
                        {filters.sankeyReady? <Button href="#filter_system">Back to Filter System</Button> : null}
                    </Row>
                </Container>
            </div>
        </div>
        <br></br>
    </Container>
    );
}

export default SankeyPage;