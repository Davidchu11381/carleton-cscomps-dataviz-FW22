import React, { Component } from 'react'
import Chart from 'react-google-charts'
const sankeyData = [
  ['From', 'To', 'Weight'],
  ['Oil & Gas', 'Politician A', 5],
  ['Oil & Gas', 'Politician B', 7],
  ['Oil & Gas', 'Politician C', 6],
  ['Education', 'Politician A', 2],
  ['Education', 'Politician B', 9],
  ['Education', 'Politician C', 4],
]
class SankeyChart extends Component {
  render() {
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