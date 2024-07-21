import React from 'react';
import './css/App.css';
// Components
import {Table} from './components/Table'
import {Login} from './components/Login'

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)

  function toggleLogin(){
    if(loggedIn) sessionStorage.removeItem("token")
    setLoggedIn(!loggedIn)
  }

  return (
    <div className="App">
      {!loggedIn && <Login toggleLogin={toggleLogin}/>}
      {loggedIn && [<Table/>, <button onClick={toggleLogin}>Logout</button>]}
    </div>
  );
}

export default App;
