import React, { Component } from 'react'
import Chart from 'react-google-charts'
const sankeyData = [
  ['From', 'To', 'Weight'],
  ['A', 'X', 5],
  ['A', 'Y', 7],
  ['A', 'Z', 6],
  ['B', 'X', 2],
  ['B', 'Y', 9],
  ['B', 'Z', 4],
]
class SankeyChart extends Component {
  render() {
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