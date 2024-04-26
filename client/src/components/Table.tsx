// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'

function Table (){
  let userId : number = 1
  let budgetId : number = 1

  const [budget, setBudget] = React.useState<any>({})
  const [budgetUpdate, setBudgetUpdate] = React.useState<any>(true)

  React.useEffect(( ) => {
    let requestInProgress = true;
    async function getData(){
      fetch(`http://localhost:3001/user/${userId}/budget/${budgetId}`)
      .then( response => {return response.json()})
      .then( data => {
        if(requestInProgress){
          setBudget(data)
          console.log('Get budget:', data)
        }
      })
    }
    getData()
    return () => { requestInProgress = false }

  },[userId, budgetId, budgetUpdate])

  function buildCategories(type: 'income' | 'expenses', budget: any): any{
    let sections : any = []
    for (var category in budget[type]) {
      let category_header = <div>{category} {type}</div>
      let entries = budget[type][category].entries
      for (let entry of entries){
        const row = <ListingRows props={entry}></ListingRows>
        sections.push(<tr>{category_header}{row}</tr>)
      }
    }
    return sections
  }

  function f(){
    console.log(budgetUpdate)
    setBudgetUpdate(!budgetUpdate)
  }

  const headings =
    <thead>
      <tr>
      </tr>
        {buildCategories('expenses', {...budget})}
      <tr>
      </tr>
        {buildCategories('income', {...budget})}
    </thead>

  
  const table =
    <div>
      <table>
          {headings}
      </table>
      <button onClick={f}>{String(budgetUpdate)}</button>
    </div>
    
  return table
}

export {Table}