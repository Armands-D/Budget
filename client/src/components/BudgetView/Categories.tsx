
import React, { Fragment, useState, useRef, createRef, useEffect, useCallback} from 'react';
import {CategoryEntries} from './Entries'
import {UserBudget} from '../../data_types/MainApi'

const category_row_class = (type:UserBudget.SectionType) => 
  `category-row ${type}`
const category_row_id = (id:number) => 
  `category-row-${id}`
const category_row_total_id = (id:number) =>
  `category-row-${id}-total`

function Categories(props: {
  type: UserBudget.SectionType,
  categories: (UserBudget.Category)[],
  sectionState: {
    updateSection: any
  }
  }
){
  let type = props.type
  const [categories, setCategories] = useState(props.categories)
  let category_rows = []
  for(let index = 0; index < categories.length; index++){
    let category: UserBudget.Category = categories[index]
    category_rows.push(
      <Fragment key={`frag-${category_row_id(category.categoryId)}`}>
        <Category
        type={type}
        category={category}
        categoriesState={{updateCategory}}
        />
      </Fragment>)
  }
  return <>{category_rows}</>

  function updateCategory(category: UserBudget.Category){
    let new_cats = []
    for(let c of categories){
      if(c.categoryId == category.categoryId){new_cats.push(category)}else{new_cats.push(c)}
    }
    setCategories(new_cats)
    props.sectionState.updateSection(categories)
  }
}

function Category(props: {
  type: UserBudget.SectionType,
  category: UserBudget.Category,
  categoriesState: {
    updateCategory: any
  }
}){
  let {type, category} = props

  let entry_lookup : Record<number, UserBudget.Entry> = Object.fromEntries(
    category.entries.map((entry, _) => [entry.entryId, entry])
  )

  const [entries, setEntries] = useState(category.entries)

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
    categoryState={{updateEntry}}
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

  function updateEntry(entry: UserBudget.Entry){
    if(! Object.keys(entry_lookup).includes(String(entry.entryId)))return console.log('Entry Not Found')
    entry_lookup[entry.entryId] = entry
    setEntries(Object.values(entry_lookup))
    props.categoriesState.updateCategory({...category, entries})
  }
}

export {Categories}