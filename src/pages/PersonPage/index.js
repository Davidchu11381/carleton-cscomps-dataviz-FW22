import React from 'react'
import { useState, useEffect} from 'react'

function PersonPage() {
    const [politicianData, setPoliticianData] = useState({
        candidate_name: "",
        state: "",
        political_party: "",
        total_cash: "",
    });

    useEffect(() => {
        fetch("/testdata").then((res) =>
            res.json().then((politicianData) => {
                setPoliticianData({
                    candidate_name: politicianData.cand_name,
                    state: politicianData.state,
                    political_party: politicianData.party,
                    total_cash: politicianData.cash_on_hand,
            });
        })
    );
}, []);

    return (
        <div className="CongressPeople-Table">
            <h1>{politicianData.candidate_name}</h1>
            {/* Calling a data from setdata for showing */}
            <p>State: {politicianData.state}</p>
            <p>Political Party: {politicianData.political_party}</p>
            <p>Total Cash: {politicianData.total_cash}</p>
        </div>
    );
}

    // function getData() {
    //     axios({
    //         method: "GET",
    //         url:"http://127.0.0.1:5000/N00041162/summary",
    //     })
    //     .then((response) => {
    //         const res = response.data
    //         setPoliticianData(({
    //             politician_name: res.cand_name,
    //             cash_on_hand: res.cash_on_hand,
    //             chamber: res.chamber,
    //             cid: res.cid,
    //             cycle: res.cycle,
    //             debt: res.debt,
    //             first_elected: res.first_elected,
    //             last_updated: res.last_updated,
    //             next_election: res.next_election,
    //             origin: res.origin,
    //             party: res.party,
    //             source: res.source,
    //             spent: res.spent,
    //             state: res.state,
    //             total: res.total}))
    //     }).catch((error) => {
    //         if (error.response) {
    //         console.log(error.response)
    //         console.log(error.response.status)
    //         console.log(error.response.headers)
    //         }
    //     })
    // }    
    // return (
    //     <Container>
    //         <div className="h1 mb-3 mt-3">Politicians in Congress</div>
    //         <PoliticianCard />
    //         {getData()}
    //         {politicianData && <div>
    //             <p>Politician Name: {politicianData.politician_name}</p>
    //             <p>Cash on Hand: {politicianData.cash_on_hand}</p>
    //         </div>
    //         }
    //     </Container>
        
        
    //     );  

export default PersonPage;
