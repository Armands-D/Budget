// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'

function Table (){
  const userId : number = 1
  const budgetId : number = 1

  // const [budget, setBudget] = React.useState({expenses : {}, income: {}})
  const [budget, setBudget] = React.useState<any>({})

  React.useEffect(( ) => {
      async function getData(){
        const response = await fetch(`http://localhost:3001/user/${userId}/budget/${budgetId}`)
        const data = await response.json()
        setBudget(data)
      }

      getData()
    },
    [userId, budgetId]
  )

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
    </div>
    
  return table
}

export {Table}