/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

function PoliticianButton( data ) {
    const redFunc = data.func;
    const info = data.politician;

    // buttons start out false => not selected
    const [initial, setInitial] = useState(false);

    function updateList (person, dispatch) {
        
        if (person.checked === false) {
            dispatch({
                type: 'REMOVE_PERSON',
                value: person.id,
            });	
        } else {
            dispatch({
                type: 'ADD_PERSON',
                value: person.id,
            });	
        };
    };
    
    return (
        <ToggleButton
            className="mb-2"
            id={info.id}
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            value="1"
            onChange={(e) => {
                console.log(e.currentTarget.id);
                setInitial(e.currentTarget.checked);
                updateList(e.currentTarget, redFunc);
            }}
        >
            {info.name}
        </ToggleButton>
    );
}

export default PoliticianButton;