/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

function StateButton( data ) {
    const dispatch = data.func;
    const info = data.state;
    const filters = data.filters;

    const [initial, setInitial] = useState(false);

    function updateList (state) {
        
        dispatch({
            type: 'REMOVE_STATE',
            value: state.id,
        });	
        dispatch({
            type: 'UPDATE_BUTTONS', 
            party: filters.party,
            chamber: filters.party,
            selectedStates: filters.selectedStates,
        });
        
    };
    
    return (
        <ToggleButton
            className="m-1"
            id={info}
            size="sm"
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            value="1"
            onChange={(e) => {
                setInitial(e.currentTarget.checked);
                updateList(e.currentTarget);
            }}
        >
            {info}
        </ToggleButton>
    );
}

export default StateButton;