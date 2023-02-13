/**
 * GroupSelectionButton.js
 * GroupSelectionButton gathers user input for data visualization
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

function GroupSelectionButton( data ) {    
    const dispatch = data.func;
    const info = data.type;
    const [initial, setInitial] = useState(false);

    function updateList (type, status) {
        
        if (status === false) {
            dispatch({
                type: 'REMOVE_VISUAL',
                value: type,
            });	
        } else {
            dispatch({
                type: 'ADD_VISUAL',
                value: type,
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
            size="sm"
            value="1"
            onChange={(e) => {
                setInitial(e.currentTarget.checked);
                updateList(info, e.currentTarget.checked);
            }}
        >
            {info}
        </ToggleButton>
    );
}

export default GroupSelectionButton;