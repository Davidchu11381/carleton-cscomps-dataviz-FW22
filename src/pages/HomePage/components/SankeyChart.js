import React, { Component } from 'react'
import Chart from 'react-google-charts'

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid_list = props.cid_list; //pass in cid_list as props in html
    this.group = props.group
    this.state = {
      ind_data : []
    };
    //this.data = [];
    this.fetchData();
  }

  fetchData() {
    console.log("group:", this.group)
    if (this.group === undefined) {
      console.log("in if")
      //fetch('http://127.0.0.1:5000/'+ this.cid +'/industry') 
      fetch('http://137.22.4.60:5001/'+ this.cid_list +'/industry') 
        .then(response => response.json())
        .then(ind_data => {
          console.log("the data:", ind_data);
          this.setState({ ind_data });
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
    // determine what to title the middle column of the sankey
    if (this.group === undefined) {
      var mid_col = this.cid_list //gonna have to change, just a cid right now not a name
    } else {
      var mid_col = this.group
    }
    var sankeyList = [['From', 'To', 'Weight']]
    var industries = this.state.ind_data.industry 
    for (let ind in industries){
      sankeyList.push([industries[ind].industry_name, mid_col, parseInt(industries[ind].total)]);
    }
    console.log(sankeyList)
    return(sankeyList)
  }

  render() {
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