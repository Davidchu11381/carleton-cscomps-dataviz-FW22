/**
 * initial state for home page
 * reducer.js
 */

export const initialState = {

	// used for display
	selectedPoliticians: new Map(),
	filteredPoliticians: new Map(),
	polList: new Map(),
	displayPoli: new Map (),
	sankeyReady: false,

	// used for filtering
    party: [],
    chamber: [],
    selectedStates: [],
};

export const reducer = (state, action) => {
	console.log(action.type, action.value);
	const value = action.value;
	let index;

	switch (action.type) {

		case 'DISPLAY_SANKEY':
			console.log("this is hte buttonstate", state.buttonState);
			return {
				...state,
				displayPoli: value,
				sankeyReady: action.buttonState,
			}

		case 'UPDATE_PARTY':
			if (state.party.includes(value)) {
				index = state.party.indexOf(value);
				state.party.splice(index, 1);
			} else {
				state.party.push(value);
			}
			return {
				...state,
			}
		
		case 'UPDATE_CHAMBER':
			if (state.chamber.includes(value)) {
				index = state.chamber.indexOf(value);
				state.chamber.splice(index, 1);
			} else {
				state.chamber.push(value);
			}
			return {
				...state,
			}
		
		case 'UPDATE_STATES':
			if(state.selectedStates.includes(value)) {
				index = state.selectedStates.indexOf(value);
				state.selectedStates.splice(index, 1);
			} else {
				state.selectedStates.push(value);
			}
			return {
				...state,
			}
		
		// related to selected politician window
		case 'ADD_PERSON':
			var haha = false;
			state.selectedPoliticians.set(value, state.polList.get(value));
			return {
				...state,
				sankeyReady: haha,
			}
		
		case 'REMOVE_PERSON':
			var hehe = false;
			state.selectedPoliticians.delete(value);
			return {
				...state,
				sankeyReady: hehe,
			}
		
		case 'DISPLAY_BUTTONS': 
			var arrayPolList = [ ...state.polList ];

			if (state.chamber.length === 1) {
				arrayPolList = arrayPolList.filter((el) => el[1].chamber.includes(state.chamber[0]));
			}

			if (state.party.length === 1) {
				arrayPolList = arrayPolList.filter((el) => el[1].party.includes(state.party[0]));
			} else if (state.party.length === 2) {
				var first = arrayPolList.filter((el) => el[1].party.includes(state.party[0]));
				var second = arrayPolList.filter((el) => el[1].party.includes(state.party[1]));
				arrayPolList = first.concat(second);
			}

			if (state.selectedStates.length !== 0) {
				let total = [];
				let inter;
				state.selectedStates.map((state) => {
					inter = arrayPolList.filter((el) => el[1].state.includes(state));
					total = total.concat(inter);
				})
				arrayPolList = total;
			}
			
			state.filteredPoliticians.clear();
			arrayPolList.forEach(per => state.filteredPoliticians.set(per[0], per[1]));
			// state.selectedPoliticians.forEach((value, key) => state.filteredPoliticians.delete(key));
			
			return {
			    ...state,
			}
		
		default:
			return state;
	}
};

// OLD CODE

	// case 'ADD_STATE':
	// 	if (state.selectedStates.includes(value)) {
	// 		return {
	// 			...state,
	// 		}
	// 	} else {
	// 		state.selectedStates.push(value);
	// 		return {
	// 			...state,
	// 		}
	// 	}	

	// case 'REMOVE_STATE':
	// 	index = state.selectedStates.indexOf(value);
	// 	state.selectedStates.splice(index, 1);
	// 	return {
	// 		...state,
	// 	}
