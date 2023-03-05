import React, { Component } from 'react';
import { Col, Row, Container, Stack, Form, Card } from 'react-bootstrap'
import Chart from 'react-google-charts';
import { tweetTopicLabels, statementTopicLabels} from '../topicLabels.js';

import style from './../index.module.css'

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid_map = props.cid_map
    this.group = props.group
    this.state = {
      indSankey : [],
      tweetSankey : [],
      stateSankey : []
    };
  }

  // fetch data and format list when component is created
  componentDidMount() {
    this.formatList();
  }
  
  // fetch data asynchronously
  async fetchData() {
    if (this.group === undefined) { //cid list
      var data = {}
      var cids = [ ... this.cid_map.keys() ]
      for (let cid in cids) {
        //api calls
        const responseInd = await fetch('http://137.22.4.60:5001/'+ cids[cid] +'/industry');
        const resultInd = await responseInd.json();
        const responseTweets = await fetch('http://137.22.4.60:5001/'+ cids[cid] +'/tweet_topics');
        const resultTweets = await responseTweets.json();
        const responseStatements = await fetch('http://137.22.4.60:5001/'+ cids[cid] +'/statement_topics');
        const resultStatements = await responseStatements.json();


        var ind_topic_dict = {};
        ind_topic_dict["industry"] = resultInd;
        ind_topic_dict["tweet_topics"] = resultTweets;
        ind_topic_dict["statement_topics"] = resultStatements;
        data[cids[cid]] = ind_topic_dict;
      }

      return(data)

    } else { //group
      const response = await fetch('http://137.22.4.60:5001/'+ this.group +'/aggregate');
      const result = await response.json();
      
      return(result)
    }
  }

  // format list when given a cid list
  formatListCids(data) {
    var ind_sankey_list = [['From', 'To', 'Weight']]
    var tweet_sankey_list = [['From', 'To', 'Weight']]
    var statement_sankey_list = [['From', 'To', 'Weight']]

    for (let cid in data) {
      var memberName = this.cid_map.get(cid)
      var industries = data[cid].industry.industry
      var tweet_topics = data[cid].tweet_topics.tweet_topics
      var statement_topics = data[cid].statement_topics.statement_topics

      // add industries to sankey list
      for (let ind in industries) {
        ind_sankey_list.push([industries[ind].industry_name, memberName, parseInt(industries[ind].total)]);
      }

      // Tweets
      // calculate topic total for scaling purposes
      var tweet_topic_total = 0;
      for (let topic in tweet_topics) {
        tweet_topic_total += parseInt(tweet_topics[topic])
      }

      for (let topic in tweet_topics) {
        let topic_name = tweetTopicLabels[topic]
        //calculate weight to scale first
        let sankey_weight = parseInt(tweet_topics[topic]) / tweet_topic_total
        let rounded_weight = parseFloat(sankey_weight.toFixed(2))
        tweet_sankey_list.push([memberName, topic_name, rounded_weight]) 
      }

      // Statements
      // calculate topic total for scaling purposes
      var statement_topic_total = 0;
      for (let topic in statement_topics) {
        statement_topic_total += parseInt(statement_topics[topic])
      }

      for (let topic in statement_topics) {
        let topic_name = statementTopicLabels[topic]
        //calculate weight to scale first
        let sankey_weight = parseInt(statement_topics[topic]) / statement_topic_total
        let rounded_weight = parseFloat(sankey_weight.toFixed(2)) 
        statement_sankey_list.push([memberName, topic_name, rounded_weight]) 
      }
    }

    return [ind_sankey_list, tweet_sankey_list, statement_sankey_list]
  }

  // format list when given a group
  formatListGroup(data) {
    var industries = data.industry
    var tweet_topics = data.tweet_topics
    var statement_topics = data.statement_topics
    var ind_sankey_list = [['From', 'To', 'Weight']]
    var tweet_sankey_list = [['From', 'To', 'Weight']]
    var statement_sankey_list = [['From', 'To', 'Weight']]

    // Industries
    for (let ind in industries) {
      ind_sankey_list.push([industries[ind].industry_name, data.group, parseInt(industries[ind].total)]);
    }

    // Tweets
    // calculate topic total for scaling purposes
    var tweet_topic_total = 0;
    for (let topic in tweet_topics) {
      tweet_topic_total += parseInt(tweet_topics[topic])
    }

    for (let topic in tweet_topics) {
      let topic_name = tweetTopicLabels[topic]
      //calculate weight to scale first
      let sankey_weight = parseInt(tweet_topics[topic]) / tweet_topic_total
      tweet_sankey_list.push([data.group, topic_name, sankey_weight]) 
    }

    // Statements
    // calculate topic total for scaling purposes
    var statement_topic_total = 0;
    for (let topic in statement_topics) {
      statement_topic_total += parseInt(statement_topics[topic])
    }

    for (let topic in statement_topics) {
      let topic_name = statementTopicLabels[topic]
      //calculate weight to scale first
      let sankey_weight = parseInt(statement_topics[topic]) / statement_topic_total
      statement_sankey_list.push([data.group, topic_name, sankey_weight]) 
    }
  
    return([ind_sankey_list, tweet_sankey_list, statement_sankey_list])
  }

  //put data into list format for google charts sankey diagrams
  async formatList() {
    var data = await this.fetchData() // wait for data to fetch
    var ind_sankey_list = []
    var tweet_sankey_list = []
    var statement_sankey_list = []

    if (this.group === undefined) { //cid list
      let lists = this.formatListCids(data)
      ind_sankey_list = lists[0]
      tweet_sankey_list = lists[1]
      statement_sankey_list = lists[2]
    } else { // group
      let lists = this.formatListGroup(data)
      ind_sankey_list = lists[0]
      tweet_sankey_list = lists[1]
      statement_sankey_list = lists[2]
    }

    const indSankey = ind_sankey_list
    this.setState({indSankey})
    const tweetSankey = tweet_sankey_list
    this.setState({tweetSankey})
    const stateSankey = statement_sankey_list
    this.setState({stateSankey})
  } 

  render() {
    let indData = this.state.indSankey
    let tweetData = this.state.tweetSankey
    let statementData = this.state.stateSankey
   
    return (
      <Container className="mt-5 pt-3 mb-3 pb-3">
      <div>
    

        {/* the legend about funding */} 
          <div className="mt-5 mb-5">
            <Card>
            <Card.Header className="lead"><strong>Industry Fundings and Politicians </strong></Card.Header>
            <Card.Body className="lead">This shows the top 10 industries by contribution total (in USD) for each selected congressperson. Note that each congressperson receives money from more than 10 industries, so the totals for each congressperson do not include contributions outside of those 10.</Card.Body>
            <Card.Footer><a href="/data#funding">More Information About Industry Funding Data</a></Card.Footer>
            </Card>
          </div>
        
        {/* the sankey */}
            {/* <p>Funding</p> */}
            <a id="sankeyStart"></a>
            <Chart
            width={'200'}
            height={'75vh'}
            chartType="Sankey"
            loader={<div>Loading Chart</div>}
            data={indData}
            rootProps={{ 'data-testid': '1' }}
            />
        <div className={style.lineCenter}>
          {/* <div className={style.line}></div> */}
        </div>
        
        <div className="mt-5 mb-5">
              <Card>
                <Card.Header className="lead"><strong>Politicians and Tweet Topics</strong></Card.Header>
                <Card.Body className="lead" >This shows the breakdown of the distribution of topics found in each congressperson’s Tweets. For each congressperson, we query their Tweets from the database and then calculate the proportion of each topic’s frequency out of the total 12 topics.</Card.Body>
                <Card.Footer><a href="/data#tweets">More Information About Tweet Data</a></Card.Footer>
              </Card>
          </div>
            {/* <p>Tweets</p> */}
            <Chart
              width={'200'}
              height={'100vh'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={tweetData}
              rootProps={{ 'data-testid': '1' }}
            />

        <div className={style.lineCenter}>
          {/* <div className={style.line}></div> */}
        </div>

        <div className="mt-5 mb-5">
            <Card>
            <Card.Header className="lead"><strong>Politicians and Statement Topics</strong></Card.Header>
            <Card.Body className="lead">This shows the breakdown of the distribution of topics found in each congressperson’s congressional statements. For each congressperson, we query their statements and then calculate the proportion of each topic’s frequency out of the total 19 topics.</Card.Body>
            <Card.Footer><a href="/data#statements">More Information About Statement Data</a></Card.Footer>
            </Card>

          </div>
            {/* <p>Statements</p> */}
            <Chart
              width={'200'}
              height={'100vh'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={statementData}
              rootProps={{ 'data-testid': '1' }}
            />
      </div>
      </Container>
    )
  }
}
export default SankeyChart