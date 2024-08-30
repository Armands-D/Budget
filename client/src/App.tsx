import React from 'react';
import './css/App.css';
// Components
import {Login} from './components/Login'
import { BudgetView } from './components/BudgetView/BudgetView';
import { createContext, useContext } from 'react';
import { Toast, ToastContextHandler } from './components/Toast/Toast';

export const ToastContext = createContext<null | ToastContextHandler>(null)

function App() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false) // Change to Auth Context
  // const [toastMessage, setToastMessage] = React.useState<string>("Default Toast")

  function toggleLogin(){
    // if(loggedIn) sessionStorage.removeItem("token")
    setLoggedIn(!loggedIn)
  }

  return (
    <ToastContext.Provider value={new ToastContextHandler()}>
      <div id='Appy' className="App">
        {!loggedIn && <Login toggleLogin={toggleLogin}/>}
        {loggedIn && <><BudgetView/><button onClick={toggleLogin}>Logout</button></>}
        <Toast></Toast>
      </div>
    </ToastContext.Provider>
  );
}

export default App;
