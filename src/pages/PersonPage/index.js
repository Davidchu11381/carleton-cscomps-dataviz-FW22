import React from 'react';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import data from "../../testing/testData.json"


function PersonPage() {

    const[congress, newCongress] = useState([]);

    useEffect(() => {
        newCongress(data.congresspeople);
        console.log("hello, ", data.congresspeople);
    }, []);

    return (
        <Container>
        <div className="h1 mb-3 mt-3">Politicians in Congress</div>
        
        {/* <div> 
        <select
            id="roomSelect"
            // onChange={(event) => { }}
        >
            <option value="empty"></option>
            {congress.map((item, index) => {
                return( 
                    <option value={item}>{item}</option>
                )})};
        </select></div> */}

        {/* {congress.map((item, index) => {
            return( 
                <p value={index}>{item}</p>
         )})}; */}
    </Container>
    );
}

export default PersonPage;
