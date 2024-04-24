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

  const expenses = []

  for (var category in budget.expenses) {
    var entries = budget.expenses[category]
    for (var entry of entries){
      const row = <ListingRows props={entry}></ListingRows>
      expenses.push(row)
    }
  }

  const income = []

  for (var category in budget.income) {
    var entries = budget.income[category]
    for (var entry of entries){
      const row = <ListingRows props={entry}></ListingRows>
      income.push(row)
    }
  }

  const headings =
    <thead>
      <tr>
        <th>Expenses</th>
      </tr>
        {expenses}
      <tr>
        <th>Income</th>
      </tr>
        {income}
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