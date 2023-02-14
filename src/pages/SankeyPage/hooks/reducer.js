/**
 * initial state for home page
 * reducer.js
 */

export const initialState = {

	// used for display
	selectedPoliticians: new Map(),
	filteredPoliticians: [],
	filteredPoliticiansMap: new Map(),
	polList: new Map(),
	// groupSelected: new Map(),

	// used for filtering
    party: "",
    chamber: "",
    selectedStates: [],
};

export const reducer = (state, action) => {
	const value = action.value;
	let index;

	switch (action.type) {

		// related to party form input
		case 'UPDATE_PARTY':
			return {
				...state,
				party: value,
			}
		
		case 'UPDATE_CHAMBER':
			return {
				...state,
				chamber: value,
			}
		
		// related to state dropdown
		case 'ADD_STATE':
			if (state.selectedStates.includes(value)) {
				return {
					...state,
				}
			} else {
				state.selectedStates.push(value);
				return {
					...state,
				}
			}	
		
		case 'REMOVE_STATE':
			index = state.selectedStates.indexOf(value);
			state.selectedStates.splice(index, 1);
			return {
				...state,
			}
		
		// related to selected politician window
		case 'ADD_PERSON':
			state.selectedPoliticians.set(value, state.polList.get(value));
			return {
				...state,
			}
		
		case 'REMOVE_PERSON':
			// index = state.selectedPoliticians.indexOf(value);
			// state.selectedPoliticians.splice(index, 1);
			state.selectedPoliticians.delete(value);
			return {
				...state,
			}
		
		// case 'UPDATE_BUTTONS': 
		// 	state.chamber = action.chamber;
		// 	state.party = action.party;
		// 	state.selectedStates = action.selectedStates;
		// 	var orgList = state.originalPolList;
			
		// 	if (state.chamber !== "") {
		// 	    orgList = orgList.filter((el)=> el.chamber.includes(state.chamber));
		// 	} 
			
		// 	if (state.party !== "") {
		// 	    if (state.party === "Democrat" || state.party === "Republican") {
		// 	        orgList = orgList.filter((el)=> el.party.includes(state.party))
		// 	    } else {
		// 	        // filters out the two main parties
		// 	        orgList = orgList.filter(el => { return !el.party.includes("Democrat")});
		// 	        orgList = orgList.filter(el => { return !el.party.includes("Republican")});
		// 	    }
		// 	}
			
		// 	if (state.selectedStates.length !== 0) {
		// 	    var theEnd = [];
		// 	    var inter = [];
		// 	    state.selectedStates.map((state) => (
		// 	        inter = orgList.filter((el) => el.state.includes(state)),
		// 	        inter.forEach(pol => theEnd.push(pol))
		// 	    ));
		// 	    orgList = theEnd;
		// 	}
			
		// 	state.filteredPoliticiansMap.clear();
		// 	orgList.forEach(per => state.filteredPoliticiansMap.set(per.id, per));
			
		// 	// this is working!
		// 	state.selectedPoliticians.forEach((value, key) => state.filteredPoliticiansMap.delete(key));
			
		// 	return {
		// 	    ...state,
		// 	    filteredPoliticians: orgList,
		// 	}
			
		
		default:
			return state;
	}
};
