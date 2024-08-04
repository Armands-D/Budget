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

    
  return[ 
  <div>
    <table>
      <tbody>
        {buildSection('income', budget.income)}
        {buildSection('expenses', budget.expenses)}
        <tr><th>Net:</th><td>{net}</td></tr>
      </tbody>
    </table>
  </div>]
}

type section_data = {
  categories: (UserBudget.Category)[]
  total: number
}

const section_row_class = 'section-row'
const section_row_id = (type:string) => `${section_row_class}-${type.toLowerCase()}`

function buildSection(type: 'income'|'expenses', section_data: section_data){
  return [
    <tr
    id={section_row_id(type)}
    className={section_row_class}>
      <th>{type.toLocaleUpperCase()}</th>
    </tr>,
    buildCategories(type, section_data.categories)
  ]
}


const category_row_class = (type:string) => `category-row ${type}`
const category_row_id = (id:number) => `category-row-${id}`
const category_row_total_id = (id:number) => `category-row-${id}-total`

function buildCategories(type: string, categories: (UserBudget.Category)[]){
  let category: UserBudget.Category;
  let category_rows = []
  for(category of categories){
    let cat_row =
      <tr
      id={category_row_id(category.categoryId)}
      className={category_row_class(type)}>
        <th>{category.name}</th>
      </tr>
    let entries = buildEntries(type, category.entries)
    category_rows.push(cat_row)
    category_rows.push(entries)
    category_rows.push(
      <tr
      id={category_row_total_id(category.categoryId)}
      className={category_row_class(type)}>
        <th>Total</th>
        <td>{category.total}</td>
      </tr>
    )
  }
  return [category_rows]
}

const entry_row_class = (type: string) => `entry-row ${type}`
const entry_row_id = (id:number) =>`entry-row-${id}`

function buildEntries(type: string, entries: (UserBudget.Entry)[]){
  let entry: UserBudget.Entry
  let entry_rows = []
  for(entry of entries){

    let entry_data = [
      <td>{entry.name}</td>,
      <td>{entry.amount}</td>
    ]

    let entry_row =
      <tr
      id={entry_row_id(entry.entryId)}
      className={entry_row_class(type)}>
        {entry_data}
      </tr>
    
    entry_rows.push(entry_row)
  }
  return [entry_rows]
}

export {Table}