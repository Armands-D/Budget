// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'

function Table (){
  let userId : number = 1
  let budgetId : number = 1

  const [budget, setBudget] = React.useState<any>(null)
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

  function buildTable(budget: any){


    if(! budget) return

    let num_categories = Object.keys(budget.expenses).length
    let num_entries = 0
    for (var cat in budget.expenses){
      num_entries += budget.expenses[cat].entries.length
    }
    let rowSpan = num_categories + num_entries + 1 // For Self

    let rows = []

    for (var cat in budget.expenses){
      rows.push(<tr><th>{cat}</th></tr>)
      for(var entry of budget.expenses[cat].entries){
        rows.push(<tr><th>{JSON.stringify(entry)}</th></tr>)
      }
    }
    return <tbody>
      <tr><th rowSpan={rowSpan}>EXPENSES</th></tr>
      {rows}
    </tbody>
  }

  const headings =
  <tbody>
  </tbody>
    // <thead>
    //   <tr>
    //   </tr>
    //     {buildCategories('expenses', {...budget})}
    //   <tr>
    //   </tr>
    //     {buildCategories('income', {...budget})}
    // </thead>

  
  const table =
    <div>
      <table>
          {buildTable(budget)}
      </table>
      <button onClick={f}>{String(budgetUpdate)}</button>
    </div>
    
  return table
}

export {Table}