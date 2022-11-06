import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import SankeyChart from './components/SankeyChart'
function App() {
  return (
    <div className="App">
        <div class="h1">
            <p>MoneyFlows</p>
        </div>
      <SankeyChart />
    </div>

  )
}
export default App