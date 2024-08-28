import React from 'react';
import './css/App.css';
// Components
import {Login} from './components/Login'
import { BudgetView } from './components/BudgetView/BudgetView';
import { createContext } from 'react';
import { Toast } from './components/Toast';

export const ToastContext = createContext<null | {message: any, setMessage: any}>(null)
function App() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false) // Change to Auth Context
  const [toastMessage, setToastMessage] = React.useState<string>("Default Toast")

  function toggleLogin(){
    // if(loggedIn) sessionStorage.removeItem("token")
    setLoggedIn(!loggedIn)
  }

  return (
    <ToastContext.Provider value={{message: toastMessage, setMessage: setToastMessage}}>
      <div id='Appy' className="App">
        {!loggedIn && <Login toggleLogin={toggleLogin}/>}
        {loggedIn && <><BudgetView/><button onClick={toggleLogin}>Logout</button></>}
        <Toast></Toast>
        <button
          onClick={e => setToastMessage(String(Math.floor(Math.random() * 100)))}
        >
          toast
        </button>
      </div>
    </ToastContext.Provider>
  );
}

export default App;
