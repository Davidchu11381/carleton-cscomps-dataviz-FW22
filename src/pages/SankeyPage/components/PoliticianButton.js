/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

function PoliticianButton( data ) {    
    const dispatch = data.func;
    const info = data.politician;
    const buttonState = data.state;
    const party = info.party;

    function partyType () {
        if (party === "Republican") {
            return 'outline-danger'
        } else if (party === "Democrat"){
            return 'outline-primary';
        } else {
            return 'outline-success';
        }
    }

    // buttons start out false => not selected
    const [initial, setInitial] = useState(buttonState);

    function updateList (person, status) {
        
        if (status === false) {
            console.log("IN THE STATUS FINDOUT", status);
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
        dispatch({
            type: 'DISPLAY_SANKEY', 
            value: "",
            buttonState: false,
        });
    };
    
    return (
        <ToggleButton
            className="mb-2"
            id={info.id}
            type="checkbox"
            variant={partyType()}
            checked={initial}
            size="sm"
            value="1"
            onChange={(e) => {
                setInitial(e.currentTarget.checked);
                updateList(info, e.currentTarget.checked);
                // partyType();
            }}
        >
            {info.name}
        </ToggleButton>
    );
}

export default PoliticianButton;