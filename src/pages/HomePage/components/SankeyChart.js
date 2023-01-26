import React, { Component } from 'react'
import Chart from 'react-google-charts'

class SankeyChart extends Component {

  constructor(props) {
    super(props);
    this.cid = props.cid; //pass in cid as props in html
    this.state = {
      data : []
    };
  }

  componentDidMount() {
    fetch('http://127.0.0.1:5001/'+ this.cid +'/industry') 
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
      });
  }

  formatList() {
    var sankeyList = [['From', 'To', 'Weight']]
    var industries = this.state.data.industry 
    for (let ind in industries){
      sankeyList.push([industries[ind].industry_name, this.state.data.cand_name, parseInt(industries[ind].total)]);
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