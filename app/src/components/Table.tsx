// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'

function Table(){
  const headings =
    <thead>
      <tr>
        <th>Expenses</th>
        <th>Income</th>
      </tr>
    </thead>

  const data = require("../sample.json")
  const expenses = data.expenses
  const incomes = data.incomes
  let max_rows :number = (expenses.length > incomes.length ? expenses.length : incomes.length )
  
  const p = {
    expenses: expenses,
    incomes: incomes,
    max_rows: max_rows,
  }

  // spread, unpacks all properties as a prop
  const listingRows = <ListingRows {...p}></ListingRows>
  
  const table =
    <table>
        {headings}
        {listingRows}
    </table>
  
  return table
}

export {Table}