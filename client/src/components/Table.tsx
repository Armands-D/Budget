// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'

const DATA = await (async function getData(){
  const response = await fetch('http://localhost:3001/user/1/budget/1')
  const data = await response.json()
  return data
})()

function Table (){

  const headings =
    <thead>
      <tr>
        <th>Expenses</th>
        <th>Income</th>
      </tr>
    </thead>

  // spread, unpacks all properties as a prop
  console.log(DATA)
  const listingRows = <ListingRows props={DATA[0]}></ListingRows>
  
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