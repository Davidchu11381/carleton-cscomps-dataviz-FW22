// the set up for the filtering system

// Test Code

// originalPolList: [{id: "N00007360", name: "Nancy Pelosi", party: "Democrat", chamber: "House", state: "California"}, 
// 			{id: "N00003389", name: "Mitch McConnell", party: "Republican", chamber: "Senate", state: "Kentucky"},
// 			{id: "Boozman", name: "John Boozman", party: "Republican", chamber: "House", state: "Arkansas"},
// 			{id: "Huffman", name: "Jared Huffman", party: "Democrat", chamber: "House", state: "California"},
// 			{id: "Klobuchar", name: "Amy Klobuchar", party: "Democrat", chamber: "Senate", state: "Minnesota"},
// 			{id: "Sanders", name: "Bernie Sanders", party: "Independent", chamber: "Senate", state: "Texas"},
// 			{id: "Doe", name: "Jane Doe", party: "Minimalisy", chamber: "House", state: "Maine"}],

// PART 1
// function displayButtons() {

//     if (filters.polList.size !== 0) {
//         var buttonArray = [ ...filters.polList.entries() ];
//         return (buttonArray.map(person => 
//         <PoliticianButton politician={{name: person[1].name, id: person[0]}} reduc={{data: filters, func: dispatch}} state={false}></PoliticianButton>));
//     }
// }

// function displayCoolButtons() {
//     var buttonArray = [ ...filters.selectedPoliticians.values() ];
//     return(buttonArray.map(person => 
//         <PoliticianButton politician={{name: person.name, id: person.id}} reduc={{data: filters, func: dispatch}} state={true}></PoliticianButton>));
// }

{/* <Col lg={4}>
    <Stack gap={2}>
        <div></div>
        <h4>Filter below:</h4>
        <Row lg={2}>
            <Col>
                <Form.Select aria-label="party-select" 
                    size="sm"
                    id="party"
                    onChange={(event) => {
                        dispatch({
                            type: 'UPDATE_BUTTONS', 
                            party: event.target.value,
                            chamber: filters.chamber,
                            selectedStates: filters.selectedStates,
                        })
                    }}>
                    <option value="">Party</option>
                    <option value="Democrat">Democrat</option>
                    <option value="Republican">Republican</option>
                    <option value="Other">Other</option>
                </Form.Select>
            </Col>
            <Col>
                <Form.Select aria-label="chamber-select"
                    size="sm"
                    id="chamber"
                    onChange={(event) => {
                        dispatch({
                            type: 'UPDATE_BUTTONS', 
                            party: filters.party,
                            chamber: event.target.value,
                            selectedStates: filters.selectedStates,
                        });
                    }}>
                    <option value="">Chamber</option>
                    <option value="House">House of Representatives</option>
                    <option value="Senate">United States Senate</option>
                </Form.Select>
            </Col>
        </Row>
        <Row lg={1}>
            <Col>
                <Form.Control 
                    size="sm" 
                    type="text" 
                    placeholder="State" 
                    class="mb-3"
                    onKeyDown={handleFilter}
                    />
                <div className="selectedStateListing">
                    {filters.selectedStates.map((state) => (
                        <StateButton state={state} filters={filters} func={dispatch}></StateButton>
                    ))}
                </div>
            </Col>
        </Row>
        <Container>
            <Row sm={3} md={3} lg={3} className={style.stuffyButtons}>
                {displayButtons()}
            </Row>
        </Container>
        <Container>
            <Row sm={2} md={2} lg={3}>
                {displayCoolButtons()}
            </Row>
        </Container>
    </Stack>
</Col> */}


// case 'UPDATE_BUTTONS': 
// state.chamber = action.chamber;
// state.party = action.party;
// state.selectedStates = action.selectedStates;
// var orgList = state.originalPolList;

// if (state.chamber !== "") {
//     orgList = orgList.filter((el)=> el.chamber.includes(state.chamber));
// } 

// if (state.party !== "") {
//     if (state.party === "Democrat" || state.party === "Republican") {
//         orgList = orgList.filter((el)=> el.party.includes(state.party))
//     } else {
//         // filters out the two main parties
//         orgList = orgList.filter(el => { return !el.party.includes("Democrat")});
//         orgList = orgList.filter(el => { return !el.party.includes("Republican")});
//     }
// }

// if (state.selectedStates.length !== 0) {
//     var theEnd = [];
//     var inter = [];
//     state.selectedStates.map((state) => (
//         inter = orgList.filter((el) => el.state.includes(state)),
//         inter.forEach(pol => theEnd.push(pol))
//     ));
//     orgList = theEnd;
// }

// state.filteredPoliticiansMap.clear();
// orgList.forEach(per => state.filteredPoliticiansMap.set(per.id, per));

// // this is working!
// state.selectedPoliticians.forEach((value, key) => state.filteredPoliticiansMap.delete(key));

// return {
//     ...state,
//     filteredPoliticians: orgList,
// }


{/* <div className='sankey-diagram'>
    <h1>DATA VIZ STUFF GOES HERE</h1>
        <SankeyChart cid={id}/>
        {[ ...filters.selectedPoliticians.values() ].map((id) => (
            <p>{id.name}'s stuff goes here</p>
        ))}
</div> */}

// PART TWO

{/* <Row md={2} lg={2}>
    <Col lg={4}>
        <Stack gap={2}>
        <h2>Filter by clicking the buttons below</h2>
        <Row>
            <h3>By Chamber</h3>
            <Row lg={2}>
                <GroupSelectionButton type="Senate" func={dispatch}></GroupSelectionButton>
                <GroupSelectionButton type="House" func={dispatch}></GroupSelectionButton>
            </Row>
        </Row>
        <Row>
            <h3>By Party</h3>
            <Row lg={2}>
            <GroupSelectionButton type="Republican" func={dispatch}></GroupSelectionButton>
            <GroupSelectionButton type="Democrat" func={dispatch}></GroupSelectionButton>
            <GroupSelectionButton type="Other" func={dispatch}></GroupSelectionButton>
            </Row>
        </Row>
        <Row>
            <h3>By State</h3>
            <Row lg={8} md={3}>
                {stateAbbrv.map(state => {
                    return (<StateButton state={state} filters={filters} func={dispatch}></StateButton>)
                })}
            </Row>
        </Row>
        </Stack>
    </Col>
    <Col>
        <h3>Sankey Diagrams goes here</h3>
        {displaySankey()}
    </Col>
</Row> */}


// REDUCER PART 2

// case 'ADD_VISUAL':
//     console.log("filtering by type");
//     var buttonArray = [ ...state.polList.values() ];
//     var thing = [];
//     if (value === "Democrat") {
//         thing = buttonArray.filter((el) => el.party.includes(value));
//         state.groupSelected.set(value, thing);
//     } else if (value === "Republican") {
//         thing = buttonArray.filter((el) => el.party.includes(value));
//         state.groupSelected.set(value, thing);
//     } else if (value === "Senate") {
//         thing = buttonArray.filter((el) => el.chamber.includes("sen"));
//         state.groupSelected.set("Senate", thing);
//     } else if (value === "House") {
//         thing = buttonArray.filter((el) => el.chamber.includes("rep"));
//         state.groupSelected.set("House", thing);
//     } else if (value === "Other") {
//         // filter out dems and republicans
//         state.groupSelected.set("House", thing);
//     }

//     console.log(thing);
//     return {
//         ...state,
//     }

// case 'REMOVE_VISUAL':
//     console.log("removing a visual");
//     state.groupSelected.delete(value);
    
//     return {
//         ...state, 
//     }