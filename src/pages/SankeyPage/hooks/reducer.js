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
	buttonState: false,

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
			console.log("the value", value);
			return {
				...state,
				displayPoli: value,
				sankeyReady: true,
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
				sankeyReady: false,
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
				sankeyReady: false,
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
				sankeyReady: false,
			}
		
		// related to selected politician window
		case 'ADD_PERSON':
			state.selectedPoliticians.set(value, state.polList.get(value));
			return {
				...state,
				sankeyReady: false,
			}
		
		case 'REMOVE_PERSON':
			state.selectedPoliticians.delete(value);
			console.log("INSIDE REMOVE PERSON:", state.selectedPoliticians, state.selectedPoliticians.size);
			return {
				...state,
				sankeyReady: false,
			}
		
		case 'DISPLAY_BUTTONS': 
			var arrayPolList = [ ...state.polList ];

			if (state.chamber.length === 1) {
				arrayPolList = arrayPolList.filter((el) => el[1].type.includes(state.chamber[0]));
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
			
			state.selectedPoliticians.clear();
			arrayPolList.forEach(per => state.selectedPoliticians.set(per[0], per[1]));
			state.filteredPoliticians.clear();
			arrayPolList.forEach(per => state.filteredPoliticians.set(per[0], per[1]));
			// state.selectedPoliticians.forEach((value, key) => state.filteredPoliticians.delete(key));
			
			return {
			    ...state,
			}
		
		case 'CLEAR_FILTER':
			state.selectedPoliticians.clear();
			state.filteredPoliticians.clear();

			return {
				...state,
				// party: [],
				// chamber: [],
				// selectedStates: [],
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
