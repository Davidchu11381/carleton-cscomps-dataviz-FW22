/**
 * initial state for home page
 * reducer.js
 * Chisomnazu C. Oguh <oguhc@carleton.edu>
 * Last updated 08-16-22
 */

// import style from '../DisplayBoard.module.css';

export const initialState = {

	// used for display
	selectedPoliticians: [],
	filteredPoliticians: [],

	// used for filtering
    party: "",
    chamber: "",
    selectedStates: [],
	originalPolList: [{id: "Pelosi", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
			{id: "McConnell", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
			{id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
			{id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
			{id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"}]

};

export const reducer = (state, action) => {
	const value = action;
	// console.log(action.type, value, ' in sankey filter reducer');
	let index;

	switch (action.type) {

		case 'UPDATE_BUTTONS': 

			state.chamber = action.chamber;
			state.party = action.party;
			state.selectedStates = action.selectedStates;
			var orgList = state.originalPolList;

			if (state.chamber !== "") {
				orgList = orgList.filter((el)=> el.chamber.includes(state.chamber));
			}
			if (state.party !== "") {
				orgList = orgList.filter((el)=> el.party.includes(state.party));
			}

			// if (state.selectedPoliticians !== []) {
			// 	orgList = orgList.filter((el)=> el.chamber.includes(state.chamber));
			// }

			return {
				...state,
				filteredPoliticians: orgList,
			}
		
		case 'ADD_STATE':
			state.selectedStates.push(value);
			return {
				...state,
			}
		
		case 'REMOVE_STATE':
			index = state.selectedStates.indexOf(value);
			state.selectedStates.splice(index, 1);
			return {
				...state,
			}
		
		case 'ADD_PERSON':
			state.selectedPoliticians.push(value);
			return {
				...state,
			}
		
		case 'REMOVE_PERSON':
			index = state.selectedPoliticians.indexOf(value);
			state.selectedPoliticians.splice(index, 1);
			return {
				...state,
			}
		
		default:
			return state;
	}
};
