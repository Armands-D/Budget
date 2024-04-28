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

  function buildTable(type : 'income' | 'expenses', budget: any){
    console.log('Building Table')

    if(! budget) return false

    let num_categories = Object.keys(budget[type]).length
    let num_entries = 0
    for (var cat in budget[type]){
      num_entries += budget[type][cat].entries.length
    }
    let rowSpan = num_categories + num_entries + 1 // For Self

    let rows = []

    for (var cat in budget[type]){
      rows.push(<tr key={`row-${cat}`}><th key={`head-${cat}`}>{cat}</th></tr>)
      for(var entry of budget[type][cat].entries){
        rows.push(<tr key={`row-${entry.name}`}><td key={`head-${entry.name}`}>{JSON.stringify(entry)}</td></tr>)
      }
    }
    return [
      <tr key={`row-${type}-sode-row`} ><th rowSpan={rowSpan} key={`head-${type}-side-row`} className={"example"}>{type.toUpperCase()}</th></tr>,
      ...rows,
    ]
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
        <tbody>
          {buildTable('expenses', budget)}
          {buildTable('income', budget)}
        </tbody>
      </table>
      <button onClick={e => setBudgetUpdate(!budgetUpdate)}>CLICK</button>
    </div>
    
  return table
}

export {Table}