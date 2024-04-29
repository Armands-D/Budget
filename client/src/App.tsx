import React from 'react';
import './css/App.css';
// Components
import {Table} from './components/Table'
import {Login} from './components/Login'

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)

  function toggleLogin(){
    setLoggedIn(!loggedIn)
  }

  return (
    <div className="App">
      <Login toggleLogin={toggleLogin}/>
      {loggedIn && <Table/>}
    </div>
  );
}

export default App;
