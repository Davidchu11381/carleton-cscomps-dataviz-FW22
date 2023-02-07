/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';
import style from './../index.module.css';

function PoliticianButton( data ) {    
    const dispatch = data.reduc.func;
    const filterStuff = data.reduc.data;
    const info = data.politician;
    const hahaState = data.state;

    // buttons start out false => not selected
    const [initial, setInitial] = useState(hahaState);

    function updateList (person, status) {
        
        if (status === false) {
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
        // dispatch({
        //     type: 'UPDATE_BUTTONS',
        //     value: person.id,
        // });	

        dispatch({
            type: 'UPDATE_BUTTONS', 
            party: filterStuff.party,
            chamber: filterStuff.chamber,
            selectedStates: filterStuff.selectedStates,
        });
    };
    
    return (
        <ToggleButton
            className="mb-2"
            id={info.id}
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            size="sm"
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