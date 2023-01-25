import React, { Component } from 'react'
import Chart from 'react-google-charts'
const barChartData = [
  ['From', 'To', 'Weight'],
  ['Oil & Gas', 'Politician A', 5],
  ['Oil & Gas', 'Politician B', 7],
  ['Oil & Gas', 'Politician C', 6],
  ['Education', 'Politician A', 2],
  ['Education', 'Politician B', 9],
  ['Education', 'Politician C', 4],
]
class BarChart extends Component {
  render() {
    return (
      <div className="container mt-5">
        <h2>Bar Chart</h2>
        <Chart
          width={700}
          height={'350px'}
          chartType="Bar Chart"
          loader={<div>Loading Chart</div>}
          data={barChartData}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    )
  }
}