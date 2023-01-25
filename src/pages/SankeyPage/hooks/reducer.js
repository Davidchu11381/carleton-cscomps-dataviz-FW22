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
	console.log(action.type, value, ' in sankey filter reducer');

	switch (action.type) {

		case 'UPDATE_PARTY':
			return {
				... state,
				party: value,
			};

		case 'UPDATE_CHAMBER':
			return {
				... state,
				chamber: value,
			};
		
		case 'ADD_STATE':
			return {
				... state,
			}
		
		case 'REMOVE_STATE':
			return {
				... state,
			}
		
		case 'ADD_PERSON':
			return {
				... state,
			}
		
		case 'REMOVE_PERSON':
			return {
				... state,
			}
		
		default:
			return state;
	}
};
