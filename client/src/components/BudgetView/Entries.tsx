
import React, { Fragment, useState }from 'react';
import {ApiError, UserBudget} from '../../api_interfaces/MainApi'
import userEvent from '@testing-library/user-event';

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
  const [entryDataUpdateTimer, setEntryUpdateTimer] = useState<NodeJS.Timeout>()
  const [entryUpdatedByTimer, setEntryUpdatedByTimer] = useState<boolean>(false)
  const entry_row_id = IDs.entry_row_id(entry.entryId)


  let entry_row_data = EntryRowData({
    entryState : {entry, setEntry},
    updateTimerState: {
      updateTimer: entryDataUpdateTimer,
      setUpdateTimer: setEntryUpdateTimer
    },
    updateStatusState:{
      updateStatus: entryUpdatedByTimer,
      setUpdateStatus: setEntryUpdatedByTimer
    }
  })

  return <>
    <tr
    onBlur={ _ => {
      clearTimeout(entryDataUpdateTimer)
      if(entryUpdatedByTimer) return
      console.log(entry_row_id, 'EntryRowOnBlur', entry)
      updateEntryDB(entry)
    }}
    id={entry_row_id}
    className={'entry'}>
      {entry_row_data}
    </tr>
  </>
}

function EntryRowData(props: {
  entryState: {
    entry: UserBudget.Entry,
    setEntry: (entry: UserBudget.Entry)=>void
  },
  updateTimerState : {
    updateTimer: NodeJS.Timeout | undefined,
    setUpdateTimer: (timer: NodeJS.Timeout | undefined)=>void
  }
  updateStatusState:{
    updateStatus: boolean,
    setUpdateStatus: (status: boolean)=>void
  }
}){

  const {entry, setEntry} = props.entryState
  const {updateTimer, setUpdateTimer} = props.updateTimerState
  const {updateStatus, setUpdateStatus} = props.updateStatusState

  let entry_name_field =<>
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
  </>

  let entry_amount_field = <>
    <td
    id={IDs.entry_row_data_id('amount', entry.entryId)}
    >
      <input
      type='text'
      onInput={(e) => {startEntryUpdateTimer({amount: Number(e.currentTarget.value)})}}
      defaultValue={entry.amount}
      id={IDs.entry_row_input_id('amount', entry.entryId)}
      />
    </td>
  </>

  return <>{entry_name_field}{entry_amount_field}</>

  function startEntryUpdateTimer({
    name = entry.name,
    amount = entry.amount
  }
  :{
    name?: UserBudget.Entry['name'],
    amount?: UserBudget.Entry['amount']
  }){
    let new_entry: UserBudget.Entry = {name, amount, entryId: entry.entryId}
    clearTimeout(updateTimer)
    setUpdateStatus(false)
    setUpdateTimer (
      setTimeout(() => {
        console.log(IDs.entry_row_id(entry.entryId), 'EntryUpdateTimer', new_entry)
        updateEntryDB(new_entry).then(updated_entry =>{if(updated_entry)setEntry(updated_entry)})
        setUpdateStatus(true)
      }, 2000)
    )
  }
}

function updateEntryDB(entry: UserBudget.Entry): Promise<UserBudget.Entry | null>{
  console.log('Updating DB Entry', entry)
  return fetch(`http://localhost:3001/entry/${entry.entryId}`,{
    method: 'PUT',
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  })
  .then(async (response: Response)=>{
    if(!response.ok){
      console.log('DB Entry update failed')
      return null;
    }
    let updated_entry: UserBudget.Entry = await response.json()
    console.log('Entry updated', updated_entry)
    return updated_entry
  })
}

export {CategoryEntries, IDs}