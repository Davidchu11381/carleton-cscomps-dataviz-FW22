import React, { Component } from 'react'
import Chart from 'react-google-charts'

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid_list = props.cid_list; //pass in cid_list as props in html
    this.group = props.group
    this.state = {
      ind_data : [],
      top_data : []
    };
    this.multiple_data = {}
    this.datatest = Array.apply(null, Array(5)).map(function () {})

    this.fetchData();
    //this.fetchDataMultiple();
  }

  /*
  fetchDataMultiple() {
    console.log("testing multiple ppl in one sankey");
    console.log("datatest:",this.datatest)
    this.datatest[0] = "hello"
    console.log("datatest[0]",this.datatest[0])
    var cids = this.cid_list.split(',');
    console.log(cids);
    for (let cid in cids) {
      console.log("cid:", cid)
      console.log("politician:", cids[cid]);
      fetch('http://137.22.4.60:5001/'+ cids[cid] +'/industry') 
        .then(response => response.json())
        .then(result => {
          console.log(result)
          this.datatest[cid] = result 
          //this is going to the wrong level somehow
        });
      
    }
    console.log("datatest:",this.datatest)
    console.log("datatest[0]",this.datatest[0])
  }

  formatListMultiple() {
    console.log("in format list multiple")
    var sankeyList = [['From', 'To', 'Weight']]
    console.log("type of multiple_data:", typeof this.multiple_data)
    for (let pol in this.multiple_data) {
      console.log("in loop")
      console.log("pol:", pol)
      console.log("multiple_data[pol]:", this.multiple_data[pol])
    }
    console.log("at end of function")
    return(sankeyList)
  } */

  fetchData() {
    console.log("group:", this.group)
    if (this.group === undefined) {
      console.log("in if")
      //fetch('http://127.0.0.1:5000/'+ this.cid +'/industry') 
      fetch('http://137.22.4.60:5001/'+ this.cid_list +'/industry') 
        .then(response => response.json())
        .then(ind_data => {
          console.log("industry data:", ind_data);
          this.setState({ ind_data });
          //this.setData(ind_data)
        });
      fetch('http://137.22.4.60:5001/'+ this.cid_list +'/topics') 
        .then(response => response.json())
        .then(top_data => {
          console.log("topic data:", top_data);
          this.setState({ top_data });
          //this.setData(ind_data)
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

  render() {
    //let sankeyData = this.formatListMultiple()
    let sankeyData = this.formatList()
    
    return (

      <div className="container mt-5">
        <h2>Sankey Diagram</h2>
        <Chart
          width={'200'}
          height={'350px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={sankeyData}
          rootProps={{ 'data-testid': '1' }}
          />
      </div>
    )
  }
}
export default SankeyChart