// React
import React, { useState } from 'react';

// Components
import {Categories} from './Categories'
import {UserBudget} from '../../data_types/MainApi'

const budget_table_class = 'budget-table'
const budget_table_id = 'budget-table'
const net_row_class = (type:string) => `net-row ${type}`
const net_row_id = 'net-row'

function Table (
  {budgetState}: {
    budgetState: {
      budget: UserBudget.Reponse | null,
      setBudget: React.Dispatch<React.SetStateAction<UserBudget.Reponse | null>>
    },
   }
) : JSX.Element
{
  const {budget, setBudget} = budgetState
  if(!budget) return <div></div>
  let net : number = UserBudget.subtract(budget.income.total, budget.expenses.total)
    
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
      className={net_row_class(net < 0 ? 'expenses' : 'income')}>
        <th>Net:</th><td>{net}</td>
      </tr>

    </tbody>
  </table>) 

  function updateSection(type: UserBudget.SectionType, section: UserBudget.Section){
    if(!budget)return
    let new_budget = {...budget, [UserBudget.SectionType[type]]: section}
    setBudget(new_budget)
  }
}

const section_row_class = (type: string) => `section-row ${type}`
const section_row_id = (type:string) => `section-row-${type}`

function BuildSection(props: {type: UserBudget.SectionType, section_data: UserBudget.Section}){
  const [section, setSection] = useState({type: props.section_data})

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
    sectionState={{updateSection}}
    />
  </>

  function updateSection(categories: UserBudget.Category[]){
    props.section_data.categories = categories
    setSection({type: props.section_data})
  }
}

export {Table}