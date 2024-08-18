
import React, { Fragment, useState, useRef, createRef, useEffect, useCallback} from 'react';
import {CategoryEntries} from './Entries'
import {UserBudget} from '../../api_interfaces/MainApi'

const category_row_class = (type:UserBudget.SectionType) => 
  `category-row ${type}`
const category_row_id = (id:number) => 
  `category-row-${id}`
const category_row_total_id = (id:number) =>
  `category-row-${id}-total`

function Categories(props: {type: UserBudget.SectionType, categories: (UserBudget.Category)[]}){
  let {type, categories} = props
  let category_rows = []
  for(let index = 0; index < categories.length; index++){
    let category: UserBudget.Category = categories[index]
    category_rows.push(
      <Fragment key={`frag-${category_row_id(category.categoryId)}`}>
        <Category
        type={type}
        category={category}
        />
      </Fragment>)
  }
  return <>{category_rows}</>
}

function Category(props: {type: UserBudget.SectionType, category: UserBudget.Category}){
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

  let cat_entries = <CategoryEntries
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

export {Categories}