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
// import React, { useState, useEffect } from 'react';

// async function getPoliticianIDS() {
// 	const allPoliticianIDs = [];

// 	// getting all the senators
// 	const response1 = await fetch('http://137.22.4.60:5001/senators/total');
// 	const data1 = await response1.json();
// 	data1.data.map(item => allPoliticianIDs.push(item));

// 	// getting all the representatives
// 	const response2 = await fetch('http://137.22.4.60:5001/representatives/total');
// 	const data2 = await response2.json();
// 	data2.data.map(item => allPoliticianIDs.push(item));

// 	console.log("here!");

// 	return allPoliticianIDs;
// }

// async function getSummaryAPICall(id) {
// 	const response = await fetch('http://137.22.4.60:5001/senators/total');
// 	const data = await response.json();
// 	// data.data.map(item => allPoliticianIDs.push(item));
// 	// console.log(data.data);
// 	return 0;
// }

// async function getSummary(id) {
// 	const data = await getSummaryAPICall(id);
// 	console.log("what!");
// 	return data;
// }

function collectPoliticians() {
	
	// const politicians = new Map();
	// const allIDs = await getPoliticianIDS();
	// const a_list = [];

	// allIDs.map((item) => {
	// 	const response1 = getSummary(item);
		
	// 	// const data1 = response1.json();
	// 	// data1.data.map(item => allPoliticianIDs.push(item));
	// 	// console.log(response1);
	// 	// a_list.push(response1);
	// });

	// console.log("the list!", a_list);

	// old code
	const map = new Map();
	const originalPolList = [{id: "N00007360", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
			{id: "N00003389", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
			{id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
			{id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
			{id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"},
			{id: "Sanders", name: "Bernie Sanders", party: "Independent", chamber: "Senate", state: "Texas"},
			{id: "Doe", name: "Jane Doe", party: "Minimalisy", chamber: "House", state: "Maine"}];

	originalPolList.forEach(per => map.set(per.id, per));

	console.log(map);

	return map;
	
}

export const initialState = {

	// used for display
	selectedPoliticians: new Map(),
	filteredPoliticians: [],
	filteredPoliticiansMap: new Map(),
	polList: [],

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
			{id: "Doe", name: "Jane Doe", party: "Minimalisy", chamber: "House", state: "Maine"}],
	easyAccessList: collectPoliticians(),
	// something: collectPoliticians(),
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

			state.filteredPoliticiansMap.clear();
			orgList.forEach(per => state.filteredPoliticiansMap.set(per.id, per));

			// this is working!
			state.selectedPoliticians.forEach((value, key) => state.filteredPoliticiansMap.delete(key));

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
			state.selectedPoliticians.set(value, state.easyAccessList.get(value));
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

		case 'ADD_IDS':
			if (action.senators !== null && action.representatives !== null) {
				console.log("THE DATA HAS BEEN SECURED");
			} else {
				console.log("STILL WAITING FOR THE DATA");
			}
		
		default:
			return state;
	}
};
