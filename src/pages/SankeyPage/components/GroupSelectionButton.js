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
    const type = data.type;
    const [initial, setInitial] = useState(false);

    function updateList () {
        if (type === "chamber") {
            dispatch({
                type: 'UPDATE_CHAMBER',
                value: data.id,
            })
        } else if (type === "party") {
            dispatch({
                type: 'UPDATE_PARTY',
                value: data.id,
            })
        }
    };
    
    return (
        <ToggleButton
            className="m-1"
            id={data.id}
            type="checkbox"
            variant="outline-primary"
            checked={initial}
            size="sm"
            value="1"
            onChange={(e) => {
                setInitial(e.currentTarget.checked);
                updateList();
            }}
        >
            {data.value}
        </ToggleButton>
    );
}

export default GroupSelectionButton;