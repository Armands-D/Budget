// React
import React from 'react';
// Components
import {ListingRows} from './ListingRows'
import {UserBudget} from 'API/src/data_types/MainApi'

function Table (
  {budget}: {budget:UserBudget.Reponse | null}
){
  if(!budget) return <div></div>
  let net : number = budget.income.total - budget.expenses.total

  const table =
    <div>
      <table>
        <tbody>
          {buildSection('income', budget.income)}
          {buildSection('expenses', budget.expenses)}
          <tr><th>Net:</th><td>{net}</td></tr>
        </tbody>
      </table>
    </div>
    
  return table
}

type section_data = {
  categories: (UserBudget.Category)[]
  total: number
}
function buildSection(name: string, section_data: section_data){
  return [
  <tr>
    <th>{name.toLocaleUpperCase()}</th>
  </tr>,
  buildCategories(section_data.categories)
  ]
}

function buildCategories(categories: (UserBudget.Category)[]){
  let category: UserBudget.Category;
  let category_rows = []
  for(category of categories){
    let cat_row = <tr><th>{category.name}</th></tr>
    let entries = buildEntries(category.entries)
    category_rows.push(cat_row)
    category_rows.push(entries)
    category_rows.push(<tr><th>Total</th><td>{category.total}</td></tr>)
  }
  return [category_rows]
}

function buildEntries(entries: (UserBudget.Entry)[]){
  let entry: UserBudget.Entry
  let entry_rows = []
  for(entry of entries){
    entry_rows.push(<tr><td>{entry.name}</td><td>{entry.amount}</td></tr>)
  }
  return [entry_rows]
}

export {Table}