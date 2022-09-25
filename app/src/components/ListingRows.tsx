// React
import exp from 'constants';
import React, { createElement } from 'react';
// Data types
import {ExpensesCategories, Expense, Incomes} from '../data/budget_data_types'

function tableSection(name: string, items: {}){
  const heading = <thead></thead>
}

function ListingRows(props: any){
  let expense_categories : ExpensesCategories = props.expenses
  var sections = []
  for(var ex_cat in expense_categories){
    const th = <th>{ex_cat}</th>
    var rows = []
    let expense_items : Expense = expense_categories[ex_cat]

    for(var item in expense_items){
      rows.push(
        <tr>
          <td>{item}</td>
          <td>{expense_items[item]}</td>
        </tr>
      )
    }
    // the creation of each item in 'sections' can be done by a seperate component 
    sections.push(
      <table>
        <thead><tr>{th}</tr></thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
  return <div>{sections}</div>
}

export {ListingRows}