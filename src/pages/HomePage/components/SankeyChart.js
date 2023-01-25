import React, { Component } from 'react'
import Chart from 'react-google-charts'
import { useState, useEffect} from 'react'
import { data } from 'jquery';

const sankeyData = [
  ['From', 'To', 'Weight'],
  ['Oil & Gas', 'Politician A', .4],
  ['Healthcare', 'Politician A', .1],
  ['Law', 'Politician A', .2],
  ['Education', 'Politician A', .2],
  ['Finance', 'Politician A', .1],
  ['Politician A', 'Abortion', .7],
  ['Politician A', 'Border',.3],
]

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.list = [];
  }

  componentDidMount() {
    fetch('http://127.0.0.1:5001/N00007360/industry')
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
      });
  }

  //kind of did it!!
  formatList() {
    var sankeyList = [['From', 'To', 'Weight']]
    var industries = this.state.data.industry 
    for (let ind in industries){
      console.log(industries[ind].industry_name)
      sankeyList.push([industries[ind].industry_name, 'Nancy Pelosi', parseInt(industries[ind].total)])

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
          width={700}
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