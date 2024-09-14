
import React, { Fragment, useContext, useState }from 'react';
import {ApiError, UserBudget} from '../../data_types/MainApi'
import userEvent from '@testing-library/user-event';
import { ToastContext } from '../Toast/Toast';

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

function CategoryEntries(props: {
  type: UserBudget.SectionType,
  category: UserBudget.Category,
  categoryState : {
    updateEntry: any
  }
}){
  let entry_rows = []
  let entries : UserBudget.Entry[] = props.category.entries
  for(let index : number = 0; index < entries.length; index++){
    entry_rows.push(
      <Fragment key={`frag-cat-${props.category.categoryId}-${IDs.entry_row_id(entries[index].entryId)}`}>
        <EntryRow
        type={props.type}
        entry={entries[index]}
        categoryState={props.categoryState}
        />
      </Fragment>)
  }
  return <>{entry_rows}</>
}

function EntryRow(props:
  {
    type: UserBudget.SectionType,
    entry: UserBudget.Entry,
    categoryState: {
      updateEntry: any
    }
  }
){
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
    },
    categoryState: props.categoryState
  })

  return <>
    <tr
    onBlur={ _ => {
      clearTimeout(entryDataUpdateTimer)
      if(entryUpdatedByTimer) return
      console.log(entry_row_id, 'EntryRowOnBlur', entry)
      let new_entry = updateEntryAPI(entry)
      if(!new_entry) return
      props.categoryState.updateEntry(new_entry)
    }}
    id={entry_row_id}
    className={'entry'}>
      {entry_row_data}
    </tr>
  </>
}

////////////////////////////////////////////////

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
  },
  categoryState: {
    updateEntry: any
  }
}){

  const {entry, setEntry} = props.entryState
  const {updateTimer, setUpdateTimer} = props.updateTimerState
  const {updateStatus, setUpdateStatus} = props.updateStatusState
  const toast_context = useContext(ToastContext)

  let entry_name_field =<>
    <td
    id={IDs.entry_row_data_id('name', entry.entryId)}
    >
      <input
      type='text'
      onInput={(e)=>{
        const name : string = e.currentTarget.value
        startEntryUpdateTimer({name})
      }}
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
      onInput={(e) => {
        const amount: number = Number(e.currentTarget.value)
        startEntryUpdateTimer({amount})
      }}
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
  : Partial<UserBudget.Entry> 
  ){
    let new_entry: UserBudget.Entry = {name, amount, entryId: entry.entryId}
    setEntry(new_entry)
    props.categoryState.updateEntry(new_entry)
    clearTimeout(updateTimer)
    setUpdateStatus(false)
    setUpdateTimer (
      setTimeout(async () => {
        console.log(IDs.entry_row_id(entry.entryId), 'EntryUpdateTimer', new_entry)
        let updated_entry = await updateEntryAPI(new_entry)
        if(!updated_entry){
          toast_context?.popUp('Whoopsies')
          console.log('popup')
        }
        setUpdateStatus(true)
      }, 2000)
    )
  }
}

function updateEntryAPI(entry: UserBudget.Entry): Promise<UserBudget.Entry | null>{
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