import React, { Component } from 'react';
import { Placeholder } from 'react-bootstrap';
import Chart from 'react-google-charts';

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid_list = props.cid_list; //pass in cid_list as props in html
    this.group = props.group
    this.state = {
      sankey : [],
      indSankey : [],
      topSankey : []
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
      var cids = this.cid_list.split(',');
      for (let cid in cids) {
        console.log("cid:", cid);
        console.log("politician:", cids[cid]);

        //api calls
        const responseInd = await fetch('http://137.22.4.60:5001/'+ cids[cid] +'/industry');
        const resultInd = await responseInd.json();
        const responseTop = await fetch('http://137.22.4.60:5001/'+ cids[cid] +'/topics');
        const resultTop = await responseTop.json();
        
        var ind_topic_dict = {};
        ind_topic_dict["industry"] = resultInd;
        ind_topic_dict["topics"] = resultTop;
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
    var top_sankey_list = [['From', 'To', 'Weight']]
    for (let cid in data) {
      var industries = data[cid].industry.industry
      var topics = data[cid].topics.topics

      //add industries to sankey list, calculate total for scaling purposes
      var ind_total = 0;
      for (let ind in industries) {
        ind_sankey_list.push([industries[ind].industry_name, cid, parseInt(industries[ind].total)]);
        ind_total  += parseInt(industries[ind].total)
      }

      // calculate topic total for scaling purposes
      var topic_total = 0;
      for (let topic in topics) {
        topic_total += parseInt(topics[topic])
      }

      for (let topic in topics) {
        //calculate weight to scale first
        let sankey_weight = parseInt(topics[topic]) / topic_total
        top_sankey_list.push([cid, topic, sankey_weight]) // need to scale somehow
      }
    }
    return [ind_sankey_list, top_sankey_list]
  }

  //format list when given a group
  formatListGroup(data) {
    //var sankey_list = [['From', 'To', 'Weight']] 
    var industries = data.industry
    var topics = data.tweet_topics
    var ind_sankey_list = [['From', 'To', 'Weight']]
    var top_sankey_list = [['From', 'To', 'Weight']]
    console.log("group topics:", topics)

    //add industries to sankey list, calculate total for scaling purposes
   // var ind_total = 0;
    for (let ind in industries) {
      ind_sankey_list.push([industries[ind].industry_name, data.group, parseInt(industries[ind].total)]);
     // ind_total  += parseInt(industries[ind].total)
    }

    // calculate topic total for scaling purposes
    var topic_total = 0;
    for (let topic in topics) {
      topic_total += parseInt(topics[topic])
    }

    for (let topic in topics) {
      //calculate weight to scale first
      let sankey_weight = parseInt(topics[topic]) / topic_total
      top_sankey_list.push([data.group, topic, sankey_weight]) // need to scale somehow
    }
  
    return([ind_sankey_list, top_sankey_list])
  }

  //put data into list format for google charts sankey diagrams
  async formatList() {
    var data = await this.fetchData() // wait for data to fetch
    var ind_sankey_list = []
    var top_sankey_list = []

    if (this.group === undefined) { //cid list
      let lists = this.formatListCids(data)
      ind_sankey_list = lists[0]
      top_sankey_list = lists[1]
    } else { // group
      let lists = this.formatListGroup(data)
      ind_sankey_list = lists[0]
      top_sankey_list = lists[1]
    }

    const indSankey = ind_sankey_list
    this.setState({indSankey})
    const topSankey = top_sankey_list
    this.setState({topSankey})
  } 



  render() {
    //let sankeyData = this.state.sankey
    let indData = this.state.indSankey
    console.log("indData:", indData)
    let topData = this.state.topSankey
    console.log("topData:", topData)
    return (
      <div className="container mt-5">
        <h2>Sankey Diagram</h2>
        <Chart
          width={'200'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={indData}
          rootProps={{ 'data-testid': '1' }}
        />
        <Chart
          width={'200'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={topData}
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