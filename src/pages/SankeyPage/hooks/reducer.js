/**
 * initial state for home page
 * reducer.js
 * Chisomnazu C. Oguh <oguhc@carleton.edu>
 * Last updated 08-16-22
 */

// import style from '../DisplayBoard.module.css';

export const initialState = {

    party: "",
    chamber: "",
    selectedStates: [],
	selectedPoliticians: []
    
};

export const reducer = (state, action) => {
	const value = action.value;
	// console.log(action.type, value, ' in sankey filter reducer');
	let index;

	switch (action.type) {

		case 'UPDATE_PARTY':
			return {
				...state,
				party: value,
			};

		case 'UPDATE_CHAMBER':
			return {
				...state,
				chamber: value,
			};
		
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
