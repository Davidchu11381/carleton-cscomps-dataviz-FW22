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
    const dispatch = data.func;
    const info = data.politician;

    // buttons start out false => not selected
    const [initial, setInitial] = useState(false);

    function updateList (person, status) {
    
        if (status === false) {
            dispatch({
                type: 'REMOVE_PERSON',
                value: person.id,
            });	
            
            // TODO: update the buttons again

        } else {
            dispatch({
                type: 'ADD_PERSON',
                value: person.id,
            });	
            
            // TODO: update the buttons again

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
                setInitial(e.currentTarget.checked);
                updateList(info, e.currentTarget.checked);
            }}
        >
            {info.name}
        </ToggleButton>
    );
}

export default PoliticianButton;