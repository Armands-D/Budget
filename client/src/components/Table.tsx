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
const section_row_id= (type:string) => `${section_row_class}-${type.toLowerCase()}`

function buildSection(name: string, section_data: section_data){
  return [
  <tr
  id={section_row_id(name)}
  className={section_row_class}>
    <th>{name.toLocaleUpperCase()}</th>
  </tr>,
  buildCategories(section_data.categories)
  ]
}


const category_row_class = 'category-row'
const category_row_id = (id:number) => `${category_row_class}-${id}`
const category_row_total_id = (id:number) => `${category_row_class}-${id}-total`

function buildCategories(categories: (UserBudget.Category)[]){
  let category: UserBudget.Category;
  let category_rows = []
  for(category of categories){
    let cat_row =
      <tr
      id={category_row_id(category.categoryId)}
      className={category_row_class}>
        <th>{category.name}</th>
      </tr>
    let entries = buildEntries(category.entries)
    category_rows.push(cat_row)
    category_rows.push(entries)
    category_rows.push(
      <tr
      id={category_row_total_id(category.categoryId)}
      className={category_row_class}>
        <th>Total</th>
        <td>{category.total}</td>
      </tr>
    )
  }
  return [category_rows]
}

const entry_row_class: string = 'entry-row'
const entry_row_id = (id:number) =>`${entry_row_class}-${id}`

function buildEntries(entries: (UserBudget.Entry)[]){
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
      className={entry_row_class}>
        {entry_data}
      </tr>
    
    entry_rows.push(entry_row)
  }
  return [entry_rows]
}

export {Table}