import React from 'react';
import {UserBudget} from 'API/src/data_types/MainApi'
import { Table } from './Table';

function BudgetView(){
  let userId : number = 1
  let budgetId : number = 1

  const [budget, setBudget] = React.useState<UserBudget.Reponse | null>(null)
  const [budgetUpdate, setBudgetUpdate] = React.useState<any>(true)

  React.useEffect(( ) => {
    let requestInProgress = true;
    async function getData(){
      fetch(`http://localhost:3001/user/${userId}/budget/${budgetId}`,{
        credentials: "include"
      })
      .then( response => {return response.json()})
      .then( budget_response => {
        if(requestInProgress){
          setBudget(budget_response)
          console.log('Get budget:', budget_response)
        }
      })
    }
    getData()
    return () => { requestInProgress = false }

  },[userId, budgetId, budgetUpdate])
  return <div>
      <Table budget={budget}/>
      <button onClick={e => setBudgetUpdate(!budgetUpdate)}>CLICK</button>
    </div>
}

export {BudgetView}