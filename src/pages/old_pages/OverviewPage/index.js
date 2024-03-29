import React, { useEffect, useReducer } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import SankeyChart from '../../SankeyPage/components/SankeyChart';

import { reducer, initialState } from './components/reducer';

function HomePage() {

    const [filters, dispatch] = useReducer(reducer, initialState);

    const addSankey = (id) => {

        dispatch({
            type: 'ADD_VIZ',
            value: id,
        });
    };

    const removeSankey = (id) => {
        dispatch({
            type: 'REMOVE_VIZ',
            value: id,
        });
    }

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    const cid_map_test = {"N00003389": "Jane Smith", "N00007360": "John Doe"}
    const cid_map2 = new Map();
    cid_map2.set("N00003389", "Jane Smith");
    cid_map2.set("N00007360", "John Doe");

    return (
        <Container>
            <div className="HomePage">
                <Row>
                    <Col>
                        <div className="pt-3 h3">
                            Overview
                        </div>
                        <div className="pt-3" >
                            <p className="lead">
                                MoneyFlow is a web application that lets you explore the relationships between funding sources and speech
                                for members of congress. We have gathered data on funding broken down by industry, statements made on the floor
                                of congress, and tweets for each politician. We then performed topic modeling on the statements and tweets
                                to gather quantitative data about what topics politicians speek about.
                            </p>
                            
                        </div>
                    </Col>
                    <Col>
                        <div className="pt-3 h4">
                            <p>How To Use</p>
                        </div>
                        <div className="pt-3 mb-3 pb-3 lead">
                            <p>You can explore these relationships through Sankey diagrams, which show the flows of money
                            to congresspeople and congresspeople to topics. This Overview Page contains diagrams depicting
                            different subsets of politicians, like Republicans or Senators</p>
                            <p>If you'd like to explore further funding flows, you can 
                            head to <a href="/congress_data">Filter by Congress</a> to curate your own filters and 
                            see the resulting diagrams.
                            </p>
                        </div>
                    
                    </Col>
                </Row>
                {/*<SankeyChart cid_list="N00007360,N00003389,N00031820"/> */}
                <Row lg={4} md= {4}>
                    <Button 
                        id="Republican"
                        onClick={(e) => 
                        !filters.showRep ? addSankey(e.currentTarget.id) : removeSankey(e.currentTarget.id)}
                        >    
                        {filters.repText[filters.repIndex]}
                    </Button>  {' '}
                    <Button 
                        id="Democrat"
                        onClick={(e) => 
                        !filters.showDem ? addSankey(e.currentTarget.id) : removeSankey(e.currentTarget.id)}
                        >    
                        {filters.demText[filters.demIndex]}
                    </Button> {' '}
                    <Button 
                        id="Representative"
                        onClick={(e) => 
                        !filters.showHouse ? addSankey(e.currentTarget.id) : removeSankey(e.currentTarget.id)}
                        >    
                        {filters.houseText[filters.houseIndex]}
                    </Button> {' '}
                    <Button 
                        id="Senator"
                        onClick={(e) => 
                        !filters.showSen ? addSankey(e.currentTarget.id) : removeSankey(e.currentTarget.id)}
                        >    
                        {filters.senText[filters.senIndex]}
                    </Button>
                </Row>
                {filters.desiredSankeys.map(type => {
                    return (<SankeyChart group={type}/>)
                    })}
            </div>
        </Container>
    );
}

export default HomePage;