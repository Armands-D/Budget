
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
  let state_handler = new CategoryState(category)

  let cat_heading =
    <tr
    id={category_row_id(state_handler.category.categoryId)}
    className={category_row_class(type)}>
      <th
      colSpan={2}>
        {category.name}
      </th>
    </tr>

  let cat_entries = <CategoryEntries
    type={type}
    category={state_handler.category}
    categoryState={state_handler}
  />

  let cat_total = <tr
    id={category_row_total_id(state_handler.category.categoryId)}
    className={category_row_class(type)}>
      <th>Total</th>
      <td>{state_handler.category.total}</td>
  </tr>

  return <>
    {cat_heading}
    {cat_entries}
    {cat_total}
  </>
}

export class CategoriesState{
  readonly categories: UserBudget.Category[]
  setCategories: any

  constructor(categories: UserBudget.Category[]){
    [this.categories, this.setCategories] = useState(categories);
  }
}

export class CategoryState{
  readonly category: UserBudget.Category
  setCategory: any
  constructor(category: UserBudget.Category){
    [this.category, this.setCategory] = useState(category);
  }

  updateEntry(entry: UserBudget.Entry){
    let entry_lookup = Object.fromEntries(this.category.entries.map(
      (entry, arr)=>[entry.entryId, entry]))
    
    if(!(entry.entryId in entry_lookup)) return console.log(entry.entryId, 'not in', entry_lookup)
    entry_lookup[entry.entryId] = entry
    let new_entries = Object.values(entry_lookup)
    this.setCategory({
      ...this.category,
      entries: new_entries,
      total: new_entries.reduce((sum, entry)=> sum + entry.amount, 0)
    })
  }
}

export {Categories}