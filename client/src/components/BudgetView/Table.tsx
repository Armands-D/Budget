// React
import React, { useState, useRef, createRef, useEffect, useCallback} from 'react';

// Components
import {ListingRows} from '../ListingRows'
import {UserBudget} from 'API/src/data_types/MainApi'

const budget_table_class = 'budget-table'
const budget_table_id = 'budget-table'
const net_row_class = (type:string) => `net-row ${type}`
const net_row_id = 'net-row'

function Table (
  {budget}: {budget:UserBudget.Reponse | null, b: boolean}
) : JSX.Element
{
  if(!budget) return <div></div>
  let net : number = budget.income.total - budget.expenses.total
    
  return (
  <table
    id={budget_table_id}
    className={budget_table_class}>
    <tbody>
      <BuildSection
      type='income'
      section_data={budget.income}
      />
      <BuildSection
      type='expenses'
      section_data={budget.expenses}
      />
      <tr
      id={net_row_id}
      className={net_row_class(net <= 0 ? 'expenses' : 'income')}>
        <th>Net:</th><td>{net}</td>
      </tr>
    </tbody>
  </table>) 
}

type section_data = {
  categories: (UserBudget.Category)[]
  total: number
}

const section_row_class = (type: string) => `section-row ${type}`
const section_row_id = (type:string) => `section-row-${type}`

function BuildSection(props: {type: 'income'|'expenses', section_data: section_data}){
  return <>
    <tr
    id={section_row_id(props.type)}
    className={section_row_class(props.type)}>
      <th
      colSpan={2}>
        {props.type.toLocaleUpperCase()}
      </th>
    </tr>
    <BuildCategories
    type={props.type}
    categories={props.section_data.categories}
    />
  </>
}

const category_row_class = (type:string) => `category-row ${type}`
const category_row_id = (id:number) => `category-row-${id}`
const category_row_total_id = (id:number) => `category-row-${id}-total`

function BuildCategories(props: {type: string, categories: (UserBudget.Category)[]}){
  let {type, categories} = props

  let category_rows = []
  for(let index = 0; index < categories.length; index++){
    let category: UserBudget.Category = categories[index]
    let cat_row =
      <tr
      id={category_row_id(category.categoryId)}
      className={category_row_class(type)}>
        <th
        colSpan={2}>
          {category.name}
        </th>
      </tr>
    category_rows.push(cat_row)
    category_rows.push(
      <BuildEntries
      type={type}
      entries={category.entries}
      />)
    category_rows.push(
      <tr
      id={category_row_total_id(category.categoryId)}
      className={category_row_class(type)}>
        <th>Total</th>
        <td>{category.total}</td>
      </tr>
    )
  }
  return <>{category_rows}</>
}

function BuildEntries(props: {type: string, entries: (UserBudget.Entry)[]}){
  let entry_rows = []
  for(let index : number = 0; index < props.entries.length; index++){
    entry_rows.push(
      <EntryRow
      type={props.type}
      entry={props.entries[index]}
      />)
  }
  return <>{entry_rows}</>
}

const entry_row_class = (type: string) => `entry-row ${type}`
const entry_row_id = (id:number) =>`entry-row-${id}`
const entry_row_data_id = (type: 'name' | 'amount', id:number) => `entry-row-data-${type}-${id}`
const entry_row_input_id = (type: 'name' | 'amount', id:number) => `entry-row-input-${type}-${id}`
function EntryRow(props: {type: string, entry: UserBudget.Entry}){
  const [entry, setEntry] = useState(props.entry)
  let entry_row_data = <>
    <td
    id={entry_row_data_id('name', entry.entryId)}
    >
      <input
      type='text'
      onInput={e=>setEntry({...entry, name: e.currentTarget.value})}
      defaultValue={entry.name}
      id={entry_row_input_id('name', entry.entryId)}
      />
    </td>
    <td
    id={entry_row_data_id('amount', entry.entryId)}
    >
      <input
      type='number'
      onInput={e=>setEntry({...entry, amount: Number(e.currentTarget.value)})}
      defaultValue={entry.amount}
      id={entry_row_input_id('amount', entry.entryId)}
      />
    </td>
  </>

  return <>
    <tr
    onBlur={e=>console.log("Sending Entry Data To DB ", entry)}
    id={entry_row_id(entry.entryId)}
    className={entry_row_class(props.type)}>
      {entry_row_data}
    </tr>
  </>
}

export {Table}