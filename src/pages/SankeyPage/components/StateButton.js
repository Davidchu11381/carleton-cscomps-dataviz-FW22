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
    const redFunc = data.func;
    const info = data.state;

    // buttons start out false => not selected
    const [initial, setInitial] = useState(true);

    function updateList (state, dispatch) {
        
        if (state.checked === false) {
            dispatch({
                type: 'REMOVE_STATE',
                value: state.id,
            });	
        } else {
            dispatch({
                type: 'ADD_STATE',
                value: state.id,
            });	
        };
    };
    
    return (
        <ToggleButton
            className="mb-2"
            id={info}
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            value="1"
            onChange={(e) => {
                // console.log(e.currentTarget.id);
                // console.log("the e.currentTarget", e.currentTarget);
                setInitial(e.currentTarget.checked);
                updateList(e.currentTarget, redFunc);
            }}
        >
            {info}
        </ToggleButton>
    );
}

export default StateButton;