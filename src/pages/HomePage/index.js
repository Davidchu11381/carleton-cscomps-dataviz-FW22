// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import SankeyChart from './components/SankeyChart'
import AboutUs from "../AboutPage/index.js"

function HomePage() {
    return (
        <>
            <div className="HomePage">
                <div class="h1">
                    <p>MoneyFlows</p>
                </div>
                <SankeyChart />
            </div>

            <button onClick={<AboutUs/>}>About Us</button>
        </>
    );
}

export default HomePage;
