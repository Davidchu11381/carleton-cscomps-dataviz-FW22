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
// function addPoliticians(a_list) {
// 	a_list.push("string")
// 	return a_list;
// }

export const initialState = {

	// used for display
	selectedPoliticians: [],
	filteredPoliticians: [],
	// something: addPoliticians([]),

	// used for filtering
    party: "",
    chamber: "",
    selectedStates: [],
	originalPolList: [{id: "N00007360", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
			{id: "N00003389", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
			{id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
			{id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
			{id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"},
			{id: "Sanders", name: "Bernie Sanders", party: "Independent", chamber: "Senate", state: "Texas"},
			{id: "Doe", name: "Jane Doe", party: "Minimalisy", chamber: "House", state: "Maine"},]

};

export const reducer = (state, action) => {
	const value = action.value;
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

			if (state.selectedStates.length !== 0) {
				var theEnd = [];
				var inter = [];
				state.selectedStates.map((state) => (
					inter = orgList.filter((el) => el.state.includes(state)),
					inter.forEach(pol => theEnd.push(pol))
				));
				orgList = theEnd;
			}

			return {
				...state,
				filteredPoliticians: orgList,
			}
		
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
