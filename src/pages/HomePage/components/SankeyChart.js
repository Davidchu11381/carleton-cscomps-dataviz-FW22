import React, { Component } from 'react';
import { Col, Row, Container, Stack, Form, Card } from 'react-bootstrap'
import Chart from 'react-google-charts';
import { tweetTopicLabels, statementTopicLabels} from '../topicLabels.js';

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid_map = props.cid_map
    //this.cid_list = props.cid_list; //pass in cid_list as props in html
    this.group = props.group
    this.state = {
      indSankey : [],
      tweetSankey : [],
      stateSankey : []
    };
  }

  //fetch data and format list when component is created
  componentDidMount() {
    this.formatList();
  }
  
  // fetch data asynchronously
  async fetchData() {
    if (this.group === undefined) { //cid list
      var data = {}
     // var cids = this.cid_list.split(',');
      var cids = [ ... this.cid_map.keys() ]
      // var cids = Object.keys(this.cid_map)
      // console.log(this.cid_map)
      console.log("cids", cids)
      for (let cid in cids) {
        // console.log("cid:", cid);
        // console.log("politician:", cids[cid]);

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
      console.log("this is the datain sankey", data)
      return(data)

    } else { //group
      const response = await fetch('http://137.22.4.60:5001/'+ this.group +'/aggregate');
      const result = await response.json();
      
      return(result)
    }
  }

  //format list when given a cid list
  formatListCids(data) {
    //var sankey_list = [['From', 'To', 'Weight']]
    var ind_sankey_list = [['From', 'To', 'Weight']]
    var tweet_sankey_list = [['From', 'To', 'Weight']]
    var statement_sankey_list = [['From', 'To', 'Weight']]
    for (let cid in data) {
      var memberName = this.cid_map.get(cid)
      console.log("memberName:", memberName)
      console.log("data[cid]:", data[cid])
      var industries = data[cid].industry.industry
      var tweet_topics = data[cid].tweet_topics.tweet_topics
      var statement_topics = data[cid].statement_topics.statement_topics

      //add industries to sankey list, calculate total for scaling purposes
      var ind_total = 0;
      for (let ind in industries) {
        ind_sankey_list.push([industries[ind].industry_name, memberName, parseInt(industries[ind].total)]);
        ind_total  += parseInt(industries[ind].total)
      }

      // Tweets
      // calculate topic total for scaling purposes
      var tweet_topic_total = 0;
      for (let topic in tweet_topics) {
        tweet_topic_total += parseInt(tweet_topics[topic])
      }

      for (let topic in tweet_topics) {
        //calculate weight to scale first
        let topic_name = tweetTopicLabels[topic]
        // console.log("topic, topic_name", topic, topic_name)
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

  //format list when given a group
  formatListGroup(data) {
    //var sankey_list = [['From', 'To', 'Weight']] 
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
      // console.log("topic, topic_name", topic, topic_name)
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
    console.log("indData:", indData)
    let tweetData = this.state.tweetSankey
    let statementData = this.state.stateSankey
    console.log("tweetData:", tweetData)
   
    return (
      <Container>
      <div className="container mt-5">
        <Row lg={2} md={2}>
          {/* the sankey */}
          <Col>
              <p>Funding</p>
              <Chart
                width={'200'}
                height={'75vh'}
                chartType="Sankey"
                loader={<div>Loading Chart</div>}
                data={indData}
                rootProps={{ 'data-testid': '1' }}
              />
          </Col>
            {/* the legend about funding */}
          <Col>
            <Card>
              <Card.Title>Funding</Card.Title>
              <Card.Body>This shows the top 10 industries by contribution total (in USD) for each selected congressperson. Note that each congressperson receives money from more than 10 industries, so the totals for each congressperson do not include contributions outside of those 10.</Card.Body>
              <Card.Footer><a href="/data#funding">More Information About Industry Funding Data</a></Card.Footer>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Row lg={2} md={2}>
          <Col>
            <p>Tweets</p>
            <Chart
              width={'200'}
              height={'100vh'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={tweetData}
              rootProps={{ 'data-testid': '1' }}
            />
          </Col>
          <Col>
            <Card>
              <Card.Title>Tweets</Card.Title>
              <Card.Body>This shows the breakdown of the distribution of topics found in each congressperson’s Tweets. For each congressperson, we query their Tweets from the database and then calculate the proportion of each topic’s frequency out of the total 12 topics.</Card.Body>
              <Card.Footer><a href="/data#tweets">More Information About Tweet Data</a></Card.Footer>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Row lg={2} md={2}>
          <Col>
            <p>Statements</p>
            <Chart
              width={'200'}
              height={'100vh'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={statementData}
              rootProps={{ 'data-testid': '1' }}
            />
          </Col>
          <Col>
            <Card>
              <Card.Title>Statements</Card.Title>
              <Card.Body>This shows the breakdown of the distribution of topics found in each congressperson’s congressional statements. For each congressperson, we query their statements and then calculate the proportion of each topic’s frequency out of the total 19 topics.</Card.Body>
              <Card.Footer><a href="/data#statements">More Information About Statement Data</a></Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
      </Container>
    )
  }
}
export default SankeyChart