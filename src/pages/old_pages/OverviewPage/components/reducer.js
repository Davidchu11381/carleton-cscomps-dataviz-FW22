/**
 * initial state for home page
 * reducer.js
 */

export const initialState = {
    // need a variable for each type
    showRep: false,
    repText: ["Show Republicans", "Hide Republicans"],
    repIndex: 0,
    showDem: false,
    demText: ["Show Democrats", "Hide Democrats"],
    demIndex: 0,
    showHouse: false,
    houseText: ["Show House of Rep", "Hide House of Rep"],
    houseIndex: 0,
    showSen: false,
    senText: ["Show Senate", "Hide Senate"],
    senIndex: 0,

    // need a variable to keep track of selected
    desiredSankeys: [],
};

export const reducer = (state, action) => {
	const value = action.value;
    let index;

	switch (action.type) {

		case 'ADD_VIZ':
            state.desiredSankeys.push(value);
            if (value === "Republican") {
                return {
                    ...state,
                    showRep: true,
                    repIndex: 1,
                }
            } else if (value === "Democrat") {
                return {
                    ...state,
                    showDem: true,
                    demIndex: 1,
                }
            } else if (value === "Representative") {
                return {
                    ...state,
                    showHouse: true,
                    houseIndex: 1,
                }
            } else if (value === "Senator") {
                return {
                    ...state,
                    showSen: true,
                    senIndex: 1,
                }
            } else {
                return {
                    ...state,
                }
            }
		
        case 'REMOVE_VIZ':
            index = state.desiredSankeys.indexOf(value);
			state.desiredSankeys.splice(index, 1);
            if (value === "Republican") {
                return {
                    ...state,
                    showRep: false,
                    repIndex: 0,
                }
            } else if (value === "Democrat") {
                return {
                    ...state,
                    showDem: false,
                    demIndex: 0,
                }
            } else if (value === "Representative") {
                return {
                    ...state,
                    showHouse: false,
                    houseIndex: 0,
                }
            } else if (value === "Senator") {
                return {
                    ...state,
                    showSen: false,
                    senIndex: 0,
                }
            } else {
                return {
                    ...state,
                }
            }
        
        case 'MODIFY_DISPLAY':

            return {
                ...state,
            }
        
		default:
			return state;
	}
};
