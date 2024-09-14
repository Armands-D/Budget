import React from 'react';
import {UserBudget} from '../../data_types/MainApi'
import { Table } from './Table';

function BudgetView(){
  const userId : number = 1
  const budgetId : number = 1

  const [budget, setBudget] = React.useState<UserBudget.Reponse| null>(null)
  const [budgetUpdate, setBudgetUpdate] = React.useState<boolean>(true)

  React.useEffect(( ) => {
    let requestInProgress = true;
    async function getUserBudget(){
      fetch(`http://localhost:3001/user/${userId}/budget/${budgetId}`,{
        credentials: "include"
      })
      .then( response => {return response.json()})
      .then( budget_response => {
        if(requestInProgress){
          setBudget(budget_response)
          console.log('Budget Fetch:', budget_response)
        }
      })
    }
    getUserBudget()
    return () => { requestInProgress = false }

  },[budgetUpdate])

  return <div id='budget'>
      <Table 
        budgetState={{budget, setBudget}}
      />
      <button id='clickbutton' onClick={()=>setBudgetUpdate(!budgetUpdate)}>CLICK</button>
    </div>
  
}

export {BudgetView}