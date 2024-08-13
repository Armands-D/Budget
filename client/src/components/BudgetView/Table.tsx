// React
import React, { Fragment, useState, useRef, createRef, useEffect, useCallback} from 'react';

// Components
import {Categories} from './Categories'
import {UserBudget} from '../../api_interfaces/MainApi'

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
      type={UserBudget.SectionType.income}
      section_data={budget.income}
      />

      <BuildSection
      type={UserBudget.SectionType.expenses}
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
function BuildSection(props: {type: UserBudget.SectionType, section_data: section_data}){
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
    <Categories
    type={props.type}
    categories={props.section_data.categories}
    />
  </>
}

export {Table}