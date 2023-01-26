/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

function PoliticianButton({ politician }) {

    // buttons start out false
    const [initial, setInitial] = useState(false);

    function updateList (person, func) {
        // access reducer associated with the sankey filter and update it
        // if (node.checked === true) {
        //     console.log("it was true");
        //     console.log(node.id);
        // } else {
        //     console.log("it was false");
        //     console.log(node.id);
        // }

        console.log(person.checked);
        
        if (person.checked === false) {
            console.log("here");
            func({
                type: 'REMOVE_PERSON',
                value: person.id,
            });	
        } else {
            console.log("there");
            func({
                type: 'ADD_PERSON',
                value: person.id,
            });	
        }
    }

    return (
        <ToggleButton
            className="mb-2"
            id={politician.id}
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            value="1"
            onChange={(e) => {
                console.log(e.currentTarget.id);
                setInitial(e.currentTarget.checked);
                // updateList(e.currentTarget);
                updateList(e.currentTarget, politician.func);
            }}
        >
            {politician.name}
        </ToggleButton>
    );
}

export default PoliticianButton;