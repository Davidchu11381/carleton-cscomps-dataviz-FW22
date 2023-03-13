/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

import React from 'react';
import { useReducer } from 'react';
import { ToggleButton } from 'react-bootstrap';
import { componentReducer, componentInitialState } from './hooks/reducer';


function StateButton( data ) {
    const dispatch = data.func;
    const info = data.state;
    const [compState, compDispatch] = useReducer(componentReducer, componentInitialState);

    function updateList () {
        dispatch({
            type: 'UPDATE_STATES',
            value: info,
        })
        compDispatch({
            type: 'UPDATE_STATES',
            value: info,
        })
    };
    
    return (
        <ToggleButton
            className="m-1"
            id={info}
            size="sm"
            type="checkbox"
            variant="outline-primary"
            checked={compState.stateInfo.get(info)}
            value="1"
            onChange={(e) => {
                updateList();
            }}
        >
            {info}
        </ToggleButton>
    );
}

export default StateButton;