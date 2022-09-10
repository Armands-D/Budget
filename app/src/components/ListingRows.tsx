// React
import exp from 'constants';
import React, { createElement } from 'react';

function ListingRows(props: any){

  var incomes_td = props.incomes.map( (income : number) =>
    <td>{income}</td>
  )

  var expenses_td = props.expenses.map( (expense : number) => 
    <td>{expense}</td>
  )
  
  var listing_rows = []
  for(var i = 0; i < props.max_rows; i++){
    var row = <tr key={i}>{expenses_td.at(i)}{incomes_td.at(i)}</tr>
    listing_rows.push(row)
  }

  return <tbody id='listings'>{listing_rows}</tbody>
}

export {ListingRows}