import React from 'react';
import './css/App.css';
// Components
import {Table} from './components/Table'

const data = async function getData(){
  const response = await fetch('http://localhost:3001/user/1/budget/1')
  const data = await response.json()
  console.log(data)
  return data
}()

function App() {
  return (
    <div className="App">
      <Table/>
    </div>
  );
}

export default App;
