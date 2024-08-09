// React
import React, { useRef, createRef} from 'react';

// Components
import {ListingRows} from '../ListingRows'
import {UserBudget} from 'API/src/data_types/MainApi'

const budget_table_class = 'budget-table'
const budget_table_id = 'budget-table'
const net_row_class = (type:string) => `net-row ${type}`
const net_row_id = 'net-row'

function Table (
  {budget}: {budget:UserBudget.Reponse | null}
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
      type='income'
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
      <BuildStatefulEntries
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

const entry_row_class = (type: string) => `entry-row ${type}`
const entry_row_id = (id:number) =>`entry-row-${id}`

const update = (entry: UserBudget.Entry, ref1: React.RefObject<HTMLDivElement>,ref2: React.RefObject<HTMLDivElement>)=>{
  console.log(ref1.current?.innerHTML, ref2.current?.innerHTML)
}

function BuildStatefulEntries(props: {type: string, entries: (UserBudget.Entry)[]}){
  return <></>
}

function EntryData(){}
function EntryRow(){}

function BuildEntries(type: string, entries: (UserBudget.Entry)[]){

  let entry_name_refs = useRef<React.RefObject<HTMLDivElement>[]>([])
  entry_name_refs.current = entries.map((_, i) =>
    entry_name_refs.current[i] ?? createRef<React.RefObject<HTMLDivElement>>())

  let entry_value_refs = useRef<React.RefObject<HTMLDivElement>[]>([])
  entry_value_refs.current = entries.map((_, i) =>
    entry_value_refs.current[i] ?? createRef<React.RefObject<HTMLDivElement>>())

  let entry_rows = []
  for(let index : number = 0; index < entries.length; index++){
    let entry: UserBudget.Entry = entries[index]
    let entry_data = [
      <td><div ref={entry_name_refs.current[index]} contentEditable>{entry.name}</div></td>,
      <td><div ref={entry_value_refs.current[index]} contentEditable>{entry.amount}</div></td>
    ]

    let entry_row =
      <tr
      onBlur={e => update(entry, entry_name_refs.current[index], entry_value_refs.current[index])}
      id={entry_row_id(entry.entryId)}
      className={entry_row_class(type)}>
        {entry_data}
      </tr>
    
    entry_rows.push(entry_row)
  }
  return [entry_rows]
}

export {Table}