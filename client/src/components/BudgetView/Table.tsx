// React
import React, { Fragment, useState, useRef, createRef, useEffect, useCallback} from 'react';

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
type SectionType= 'income' | 'expenses'
function BuildSection(props: {type: SectionType, section_data: section_data}){
  let section_heading = <tr
    id={section_row_id(props.type)}
    className={section_row_class(props.type)}>
      <th
      colSpan={2}>
        {props.type.toLocaleUpperCase()}
      </th>
    </tr>
  
  return <>
    {section_heading}
    <BuildCategories
    type={props.type}
    categories={props.section_data.categories}
    />
  </>
}

const category_row_class = (type:string) => `category-row ${type}`
const category_row_id = (id:number) => `category-row-${id}`
const category_row_total_id = (id:number) => `category-row-${id}-total`
function BuildCategories(props: {type: SectionType, categories: (UserBudget.Category)[]}){
  let {type, categories} = props
  let category_rows = []
  for(let index = 0; index < categories.length; index++){
    let category: UserBudget.Category = categories[index]
    category_rows.push(
      <Fragment key={`frag-${category_row_id(category.categoryId)}`}>
        <BuildCategory
        type={type}
        category={category}
        />
      </Fragment>)
  }
  return <>{category_rows}</>
}

function BuildCategory(props: {type: SectionType, category: UserBudget.Category}){
  let {type, category} = props
  let cat_heading =
    <tr
    id={category_row_id(category.categoryId)}
    className={category_row_class(type)}>
      <th
      colSpan={2}>
        {category.name}
      </th>
    </tr>

  let cat_entries = <BuildCategoryEntries
    type={type}
    category={category}
  />

  let cat_total = <tr
    id={category_row_total_id(category.categoryId)}
    className={category_row_class(type)}>
      <th>Total</th>
      <td>{category.total}</td>
  </tr>

  return <>
    {cat_heading}
    {cat_entries}
    {cat_total}
  </>

}

function BuildCategoryEntries(props: {type: SectionType, category: UserBudget.Category}){
  let entry_rows = []
  let entries : UserBudget.Entry[] = props.category.entries
  for(let index : number = 0; index < entries.length; index++){
    entry_rows.push(
      <Fragment key={`frag-cat-${props.category.categoryId}-${entry_row_id(entries[index].entryId)}`}>
        <EntryRow
        type={props.type}
        entry={entries[index]}
        />
      </Fragment>)
  }
  return <>{entry_rows}</>
}

const entry_row_class = (type: string) => `entry-row ${type}`
const entry_row_id = (id:number) =>`entry-row-${id}`
const entry_row_data_id = (type: 'name' | 'amount', id:number) => `entry-row-data-${type}-${id}`
const entry_row_input_id = (type: 'name' | 'amount', id:number) => `entry-row-input-${type}-${id}`
function EntryRow(props: {type: SectionType, entry: UserBudget.Entry}){
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