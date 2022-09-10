// React
import exp from 'constants';
import React, { createElement } from 'react';

function tableSection(name: string, items: {}){
  const heading = <thead></thead>
}

function ListingRows(props: any){
  let expenses : any = props.expenses
  var sections = []
  for(var ex in expenses){
    const th = <th>{ex}</th>
    var rows = []
    let expense_items : any = expenses[ex]
    for(var item in expense_items){
      rows.push(
        <tr><td>{item}</td><td>{expense_items[item]}</td></tr>
      )
    }
    // the creation of each item in 'sections' can be done by a seperate component 
    sections.push(
      <div>
        <thead><tr>{th}</tr></thead>
        <tbody>
          {rows}
        </tbody>
      </div>
    )
  }
  return <div>{sections}</div>
}

export {ListingRows}