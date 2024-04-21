// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'
// Data types
//import {Budget} from '../data/budget_data_types'

function Table(){
  const headings =
    <thead>
      <tr>
        <th>Expenses</th>
        <th>Income</th>
      </tr>
    </thead>

  //const data: Budget = require("../sample.json")
  //let max_rows :number = (expenses.length > incomes.length ? expenses.length : incomes.length )
  

  // spread, unpacks all properties as a prop
  const listingRows = <ListingRows></ListingRows>
  
  const table =
    <div>
      <table>
          {headings}
      </table>
      {listingRows}
    </div>
    
  return table
}

export {Table}