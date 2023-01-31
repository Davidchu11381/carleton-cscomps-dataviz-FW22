/**
 * initial state for home page
 * reducer.js
 * Chisomnazu C. Oguh <oguhc@carleton.edu>
 * Last updated 08-16-22
 */

// import style from '../DisplayBoard.module.css';

/* 
	create a function that makes an API call and returns a list (or JSON object) of all the politicians
		and save it into originalPolList
	
	for each politician:
		open_secrets ID
		name
		party
		state
		chamber
*/
function addPoliticians(a_list) {
	a_list.push("string")
	return a_list;
}

export const initialState = {

	// used for display
	selectedPoliticians: [],
	filteredPoliticians: [],
	something: addPoliticians([]),
	filtersUsed: 0,

	// used for filtering
    party: "",
    chamber: "",
    selectedStates: [],
	originalPolList: [{id: "N00007360", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
			{id: "N00003389", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
			{id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
			{id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
			{id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"},
			{id: "Sanders", name: "Bernie Sanders", party: "Independent", chamber: "Senate", state: "Texas"},]

};

export const reducer = (state, action) => {
	const value = action.value;
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
				if (state.party === "Democrat" || state.party === "Republican") {
					orgList = orgList.filter((el)=> el.party.includes(state.party))
				} else {
					// filters out the two main parties
					orgList = orgList.filter(el => { return !el.party.includes("Democrat")});
					orgList = orgList.filter(el => { return !el.party.includes("Republican")});
				}
			}

			// if (state.selectedPoliticians !== []) {
			// 	orgList = orgList.filter((el)=> el.chamber.includes(state.chamber));
			// }

			return {
				...state,
				filteredPoliticians: orgList,
			}
		
		case 'ADD_STATE':
			console.log("IN ADD STATE");
			// need to check is state is already in there
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
