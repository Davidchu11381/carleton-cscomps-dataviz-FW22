import React from 'react'
import { useState, useEffect} from 'react'
import { Container, Col, Row } from 'react-bootstrap';


/* 
 * page that would contain information about individual congresspoeple
 */
function PersonPage() {

    // "declaring" variables
    //should be a better way to do this w/o having separate variables, but works for now
    const [politicianIndustryData, setPoliticianIndustryData] = useState({
        candidate_name: "",
        cid: "",
        industry: [],
    });

    const [politicianDemoData, setPoliticianDemoData] = useState({
        state: "",
        political_party: "",
        total_cash: "",
    });
    // IGNORE THIS

    // useEffect(() => {
    //     fetch("/testdata").then((res) =>
    //         res.json().then((politicianData) => {
    //             setPoliticianData({
    //                 candidate_name: politicianData.cand_name,
    //                 state: politicianData.state,
    //                 political_party: politicianData.party,
    //                 total_cash: politicianData.cash_on_hand,
    //             });
    //         })
    //     );
    // }, []);


    // accessing the api and initializing the variables

    useEffect(() => {
        fetch('http://127.0.0.1:5001/N00007360/industry')
        .then((data) => {return data.json()})
        .then((post) => {
            setPoliticianIndustryData({
                candidate_name : post.cand_name,
                cid : post.cid,
                industry: post.industry,
            });
        });
        fetch('http://127.0.0.1:5001/N00007360/summary')
        .then((data) => {return data.json()})
        .then((post) => {
            setPoliticianDemoData({
                state : post.state,
                political_party : post.party,
                total_cash: post.total,
            });
        });
    }, []);

  
    // TESTING CODE
    // console.log(politicianData.industry[0]);
    // console.log(politicianData.industry);
    // console.log(politicianData.industry.length);
    // politicianData.industry.forEach(item => console.log(item.industry_name, item.total));


    // the html for the page
    
    return (
        <div>
        {/* <Container>
            <div className="h1 mb-3 mt-3">Politicians in Congress</div>
            <PoliticianCard />
            {getData()}
            {politicianData && <div>
                <p>Politician Name: {politicianData.politician_name}</p>
                <p>Cash on Hand: {politicianData.cash_on_hand}</p>
            </div>
       </Container> */}
        <Container>
            <div className="PersonPage">
                <Row>
                <Col> 
                    <Row>
                        <div className="picture">
                            {/* IMAGE WILL GO HERE */}
                            <h1>{politicianIndustryData.candidate_name}</h1>
                        </div>
                    </Row>
                    <Row>
                        <div className="information">
                            <p>CID: {politicianIndustryData.cid}</p>
                            <p>State: {politicianDemoData.state}</p>
                            <p>Political Party: {politicianDemoData.political_party}</p>
                            <p>Total Cash: ${politicianDemoData.total_cash}</p>
                        </div>
                    </Row>
                </Col>
                <Col>
                    <div className="industries">
                        <h1>Top 10 Industries</h1>

                        <ul>
                            {/*politicianData.industry.forEach(item => <li>{item}</li>)*/}
                        </ul>

                        {/* {politicianData.industry.map((item, index) => {
                            return (<p>{item.industry_name}</p>)})
                        } */}
                            {/* for (var item in politicianData.industry) {
                            return <p>Dancing</p>;
                        }} */}
                        {/* {getIndustryList(politicianData.industry)} */}

                        {/* {politicianData.industry.map((item, index) => {
                            return(<p>{item.industry_name}</p>)
                        })}  */}
                        {/* something will go here.... */}
                    </div>
                </Col>
            {/* where industries will be listed with designs and stuff */}
                <Col>
                    <Row>
                        <div className="statements">
                            <p>Statements will go here</p>
                        </div>
                    </Row>
                    <Row>
                        <div className="tweets">
                            <p>Tweets will go here</p>
                        </div>
                    </Row>
                </Col>
                </Row>

            {/* for overall page */}
            </div>
        </Container>
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