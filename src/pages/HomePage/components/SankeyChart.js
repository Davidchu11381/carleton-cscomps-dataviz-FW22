import React, { Component } from 'react';
import { Placeholder } from 'react-bootstrap';
import Chart from 'react-google-charts';

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
    

      var cids = Object.keys(this.cid_map)
      console.log("cids", cids)
      for (let cid in cids) {
        console.log("cid:", cid);
        console.log("politician:", cids[cid]);

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

  //format list when given a cid list
  formatListCids(data) {
    //var sankey_list = [['From', 'To', 'Weight']]
    var ind_sankey_list = [['From', 'To', 'Weight']]
    var tweet_sankey_list = [['From', 'To', 'Weight']]
    var statement_sankey_list = [['From', 'To', 'Weight']]
    for (let cid in data) {
      var memberName = this.cid_map[cid]
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
        let sankey_weight = parseInt(tweet_topics[topic]) / tweet_topic_total
        tweet_sankey_list.push([memberName, topic, sankey_weight]) 
      }

      // Statements
      // calculate topic total for scaling purposes
      var statement_topic_total = 0;
      for (let topic in statement_topics) {
        statement_topic_total += parseInt(statement_topics[topic])
      }

      for (let topic in statement_topics) {
        //calculate weight to scale first
        let sankey_weight = parseInt(statement_topics[topic]) / statement_topic_total
        statement_sankey_list.push([memberName, topic, sankey_weight]) 
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
      //calculate weight to scale first
      let sankey_weight = parseInt(tweet_topics[topic]) / tweet_topic_total
      tweet_sankey_list.push([data.group, topic, sankey_weight]) 
    }

    // Statements
    // calculate topic total for scaling purposes
    var statement_topic_total = 0;
    for (let topic in statement_topics) {
      statement_topic_total += parseInt(statement_topics[topic])
    }

    for (let topic in statement_topics) {
      //calculate weight to scale first
      let sankey_weight = parseInt(statement_topics[topic]) / statement_topic_total
      statement_sankey_list.push([data.group, topic, sankey_weight]) 
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


  getChartName() {
    let chartName = "";
    if (this.group === undefined) {
      let cids = this.cid_map
      let names = []
      for (let cid in cids) {
        names.push(this.cid_map[cid])
      }
      chartName = names.join(", ")

    } else {
      chartName = this.group
      chartName = chartName.concat("s")
    }

    return(chartName)
  }

  render() {
    //let sankeyData = this.state.sankey
    let indData = this.state.indSankey
    let tweetData = this.state.tweetSankey
    let statementData = this.state.stateSankey
    console.log("tweetData:", tweetData)
    let chartName = this.getChartName()

    return (
      <div className="container mt-5">
        <h2>{chartName}</h2>
        <p>Funding</p>
        <Chart
          width={'100'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={indData}
          rootProps={{ 'data-testid': '1' }}
        />
        <p></p>
        <p>Tweets</p>
        <Chart
          width={'100'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={tweetData}
          rootProps={{ 'data-testid': '1' }}
        />
        <p></p>
        <p>Statements</p>
        <Chart
          width={'100'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={statementData}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    )
  }
}
export default SankeyChart



/* OLD STUFF
  fetchData() {
    console.log("group:", this.group)
    if (this.group === undefined) {
      console.log("in if")
      fetch('http://137.22.4.60:5001/'+ this.cid_list +'/industry') 
        .then(response => response.json())
        .then(ind_data => {
          console.log("industry data:", ind_data);
          this.setState({ ind_data });
        });
      fetch('http://137.22.4.60:5001/'+ this.cid_list +'/topics') 
        .then(response => response.json())
        .then(top_data => {
          console.log("topic data:", top_data);
          this.setState({ top_data });
        });
    } else {
      console.log("in else")
      fetch('http://137.22.4.60:5001/'+ this.group +'/aggregate') 
      .then(response => response.json())
      .then(ind_data => {
        console.log("the data:", ind_data);
        console.log("industry specifically: ", ind_data.industry)
        this.setState({ ind_data });
      });
    }
  }

  formatList() {
    // determine what to title the middle column of the sankey, set topics
    if (this.group === undefined) {
      var mid_col = this.cid_list //gonna have to change, just a cid right now not a name
      var topics = this.state.top_data.topics
    } else {
      var mid_col = this.group
      var topics = this.state.ind_data.tweet_topics
    }
    var industries = this.state.ind_data.industry
    var sankeyList = [['From', 'To', 'Weight']]

    //get total of industries, to match topics to industries
    var ind_total = 0;
    for (let ind in industries) {
      sankeyList.push([industries[ind].industry_name, mid_col, parseInt(industries[ind].total)]);
      ind_total  += parseInt(industries[ind].total)
    }
    
    var topic_total = 0;
    for (let topic in topics) {
      topic_total += parseInt(topics[topic])
    }

    for (let topic in topics) {
      //calculate weight to scale first
      let sankey_weight = (parseInt(topics[topic]) * ind_total) / topic_total
      sankeyList.push([mid_col, topic, sankey_weight]) // need to scale somehow
    }
    console.log(sankeyList)
    return(sankeyList)
  }
  */