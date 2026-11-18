import './CSS/App.css';
import buildings from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart.js';
import { useState } from 'react';

function App() {
  const [filtered, setFiltered] = useState(buildings);
  return (
    <div className="App">
       <h3>Самые высокие здания и сооружения</h3>
       <Chart data={ filtered }/>
       <Table data={ buildings } amountRows="15" isPag="1" 
       filter = {filtered} onFilter ={setFiltered}/>

    </div>
  );
}

export default App;