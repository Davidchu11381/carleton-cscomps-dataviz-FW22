import React, { useEffect } from 'react';
// import { useState, useReducer } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
// import SankeyChart from './components/SankeyChart';
// import style from "./index.module.css"

function DataPage() {

    return (
        <Container>
            <div className="DataPage">
                <Row><div></div></Row>
                <Row>
                    <a id="funding"></a>
                    <div className="pt-3 h2" id="funding">Funding Data</div>
                    <p className="lead">
                        Funding data was collected from the OpenSecrets API. This data consists 
                        of the contributions to each congressperson in the 116th Congress from 
                        the top ten contributing industries for that congressperson, based on 
                        contributions made in the 2020 election cycle. OpenSecrets groups 
                        contributions into 83 industries, and the dollar amounts displayed 
                        in our Funding visualization reflect the total contributions from all 
                        individuals, corporations, or PACs affiliated with the specified 
                        industry to the given congressperson. For more information, 
                        see <a href="https://www.opensecrets.org/industries/">https://www.opensecrets.org/industries/</a>.
                    </p>
                    <a id="tweets"></a>
                    <div className="pt-3 h2" id="tweets">Tweet Data</div>
                    <p className="lead">
                    Tweet data was collected from the Twitter API. We collected all available 
                    Tweets for each congressperson with a public Twitter account in the 116th 
                    Congress. To extract the topic categories displayed in our visualizations, 
                    we fit a Latent Dirichlet Allocation (LDA) statistical language model to a 
                    subset of the Tweets consisting of one hundred randomly selected Tweets for 
                    each congressperson. For each Tweet in this subset, the LDA model assigned 
                    probabilities that the Tweet was about one of our twelve topics. We labeled 
                    the topics by manually examining the tweets that were assigned high 
                    probabilities and gleaning their topics. The proportions displayed in the 
                    Tweets visualization are calculated as follows: 
                    <ol>
                        <li>
                        For topic X, count the number of Tweets where the highest probability is assigned 
                        to topic X and that probability is at least 0.15 (a threshold we set after manually 
                        inspecting the coherence of topics with decreasing probability).
                        </li>
                        <li>
                        Divide this number by the total number of Tweets that assigned at least 
                        0.15 probability to some topic.
                        </li>
                    </ol>
                    </p>
                    <a id="statements"></a>
                    <div className="pt-3 h2" id="statements">Statement Data</div>
                    <p className="lead">
                    Statement data was collected from the Congressional Record API and consists of 
                    statements made by congress people during the 116th Congress on the House or 
                    Senate floors. Like the Tweet data, we intuited the statement topics by fitting 
                    a LDA model to the statement data; unlike the Tweet data, we categorized the 
                    statements into twenty-five topics. We followed the same manual procedure to 
                    label the statement topics, and determined a classification threshold of 0.2 
                    using the same inspection procedure we used to find the 0.15 threshold for the 
                    Tweet data. The proportions displayed in the Statements visualization are 
                    calculated similarly to the proportions in the Tweets visualization.
                    </p>
                </Row>
            </div>
        </Container>
    );
}

export default DataPage;

// OLD CODE

    // const navigate = useNavigate();
    // const switchtoIndustryPage = () => {
    //     console.log("switching to industry page");
    //     navigate('/industry');
    // }
    
    // const switchtoCongressPage = () => {
    //     console.log("switching to congress page");
    //     navigate('/congress')
    // }