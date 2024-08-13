
import React, { Fragment, useState, useRef, createRef, useEffect, useCallback} from 'react';
import {UserBudget} from '../../api_interfaces/MainApi'

function CategoryEntries(props: {type: UserBudget.SectionType, category: UserBudget.Category}){
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
function EntryRow(props: {type: UserBudget.SectionType, entry: UserBudget.Entry}){
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

export {CategoryEntries}