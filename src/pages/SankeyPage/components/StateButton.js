/**
 * PoliticianButton.js
 * PoliticianButton for Sankey filtering system
 * Last updated 03-22-22
 */

// import styles from './HeaderBar.module.css';
import React from 'react';
import { useReducer } from 'react';
import { ToggleButton } from 'react-bootstrap';
import { compReducer, compInitialState } from './hooks/reducer';


function StateButton( data ) {
    const dispatch = data.func;
    const info = data.state;
    // const [initial, setInitial] = useState(false);
    const [compState, compDispatch] = useReducer(compReducer, compInitialState);

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
            // checked={initial}
            checked={compState.stateInfo.get(info)}
            value="1"
            onChange={(e) => {
                // setInitial(e.currentTarget.checked);
                updateList();
            }}
        >
            {info}
        </ToggleButton>
    );
}

export default StateButton;