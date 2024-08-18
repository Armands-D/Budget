
import React, { Fragment, useState }from 'react';
import {UserBudget} from '../../api_interfaces/MainApi'

namespace IDs {
  export const entry_row_class = (type: UserBudget.Entry['name' | 'amount'])=>
    `entry-row ${type}`
  export const entry_row_id = (id:number) =>
    `entry-row-${id}`
  export const entry_row_data_id = (type: UserBudget.Entry['name' | 'amount'], id:number) =>
    `entry-row-data-${type}-${id}`
  export const entry_row_input_id = (type: UserBudget.Entry['name' | 'amount'], id:number) =>
    `entry-row-input-${type}-${id}`
}

function CategoryEntries(props: {type: UserBudget.SectionType, category: UserBudget.Category}){
  let entry_rows = []
  let entries : UserBudget.Entry[] = props.category.entries
  for(let index : number = 0; index < entries.length; index++){
    entry_rows.push(
      <Fragment key={`frag-cat-${props.category.categoryId}-${IDs.entry_row_id(entries[index].entryId)}`}>
        <EntryRow
        type={props.type}
        entry={entries[index]}
        />
      </Fragment>)
  }
  return <>{entry_rows}</>
}

function EntryRow(props: {type: UserBudget.SectionType, entry: UserBudget.Entry}){
  const {type} = props
  const [entry, setEntry] = useState<UserBudget.Entry>(props.entry)
  const [entryUpdateTimer, setEntryUpdateTimer] = useState<NodeJS.Timeout>()
  const entry_row_id = IDs.entry_row_id(entry.entryId)

  function startEntryUpdateTimer({name = entry.name, amount = entry.amount}){
    setEntry({...entry, name: name, amount: amount})
    clearInterval(entryUpdateTimer)
    setEntryUpdateTimer(
      setInterval(() => {
        console.log(entry_row_id, 'EntryUpdateTimer', entry)
        updateEntryDB(entry)
        clearInterval(entryUpdateTimer)
      }, 2000)
    )
  }

  function updateEntryDB(entry: UserBudget.Entry){
    console.log('Updating DB Entry', entry)
  }

  let entry_row_data = <>
    <td
    id={IDs.entry_row_data_id('name', entry.entryId)}
    >
      <input
      type='text'
      onInput={(e) => {startEntryUpdateTimer({name: e.currentTarget.value})}}
      defaultValue={entry.name}
      id={IDs.entry_row_input_id('name', entry.entryId)}
      />
    </td>
    <td
    id={IDs.entry_row_data_id('amount', entry.entryId)}
    >
      <input
      type='number'
      onInput={(e) => {startEntryUpdateTimer({amount: Number(e.currentTarget.value)})}}
      defaultValue={entry.amount}
      id={IDs.entry_row_input_id('amount', entry.entryId)}
      />
    </td>
  </>

  return <>
    <tr
    onBlur={ _ => {
      clearInterval(entryUpdateTimer)
      console.log(entry_row_id, 'EntryRowOnBlur',entry)
      updateEntryDB(entry)
    }}
    id={entry_row_id}
    className={'entry'}>
      {entry_row_data}
    </tr>
  </>
}

export {CategoryEntries, IDs}