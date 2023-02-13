// the set up for the filtering system

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


{/* <div className='sankey-diagram'>
    <h1>DATA VIZ STUFF GOES HERE</h1>
        <SankeyChart cid={id}/>
        {[ ...filters.selectedPoliticians.values() ].map((id) => (
            <p>{id.name}'s stuff goes here</p>
        ))}
</div> */}