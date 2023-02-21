/**
 * initial state for filtering buttons
 * reducer.js
 */

function createChamberMap() {
    var chambers = new Map();
    chambers.set("sen", false);
    chambers.set("rep", false);
    return chambers;
}

function createPartyMap() {
    var parties = new Map();
    ["Republican", "Democrat", "Independent"].map((el) => {
        parties.set(el, false)
    })
    return parties;
}

function createStateMap() {
    var states = new Map();
    [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
    'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
    'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
    'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
    'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'].map((el) => {
        states.set(el, false);
    })
    return states;
}

export const compInitialState = {
    stateInfo: createStateMap(),
    chamberInfo: createChamberMap(),
    partyInfo: createPartyMap(),
};

export const compReducer = (state, action) => {
	console.log("inside the mini reducer:", action.type, action.value);
	const value = action.value;

	switch (action.type) {

		case 'CLEAR_EVERYTHING':
            state.chamberInfo.forEach((val, key) => state.chamberInfo.set(key, false));
            state.partyInfo.forEach((val, key) => state.partyInfo.set(key, false));
            state.stateInfo.forEach((val, key) => state.stateInfo.set(key, false));
            return {
                ...state,
            }

		case 'UPDATE_CHAMBER':
            if (state.chamberInfo.get(value)) {
                state.chamberInfo.set(value, false);
            } else {
                state.chamberInfo.set(value, true);
            }
            console.log("in minireducer", state.chamberInfo);
			return {
				...state,
			}
        
        case 'UPDATE_PARTY':
            if (state.partyInfo.get(value)) {
                state.partyInfo.set(value, false);
            } else {
                state.partyInfo.set(value, true);
            }
            console.log("in minireducer", state.partyInfo);
			return {
				...state,
			}
        
        case 'UPDATE_STATES':
            if (state.stateInfo.get(value)) {
                state.stateInfo.set(value, false);
            } else {
                state.stateInfo.set(value, true);
            }
            console.log("in minireducer", state.stateInfo);
            return {
                ...state,
            }
		
		default:
			return state;
	}
};