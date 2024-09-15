
import React, { Fragment, useContext, useState }from 'react';
import {ApiError, UserBudget} from '../../data_types/MainApi'
import userEvent from '@testing-library/user-event';
import { ToastContext } from '../Toast/Toast';
import {CategoryState} from './Categories'

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
  categoryState : CategoryState
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
  const state_handler = new EntryStateHandler(props.entry)
  const entry_row_id = IDs.entry_row_id(state_handler.entry.entryId)


  let entry_row_data = EntryRowData({
    entryStateHandler: state_handler,
    categoryState: props.categoryState
  })

  return <>
    <tr
    onBlur={ _ => {
      clearTimeout(state_handler.entryUpdateTimer)
      if(state_handler.entryUpdatedByTimer) return
      console.log(entry_row_id, 'EntryRowOnBlur', state_handler.entry)
      updateEntryAPI(state_handler.entry).then((new_entry)=>{
        if(!new_entry) return
        props.categoryState.updateEntry(new_entry)
      })
    }}
    id={entry_row_id}
    className={'entry'}>
      {entry_row_data}
    </tr>
  </>
}

////////////////////////////////////////////////

function EntryRowData(props: {
  entryStateHandler: EntryStateHandler,
  categoryState: {
    updateEntry: any
  }
}){
  const state_handler = props.entryStateHandler

  let entry_name_field =<>
    <td
    id={IDs.entry_row_data_id('name', state_handler.entry.entryId)}
    >
      <input
      type='text'
      onInput={(e)=>{
        const name : string = e.currentTarget.value
        startEntryUpdateTimer({name})
      }}
      defaultValue={state_handler.entry.name}
      id={IDs.entry_row_input_id('name', state_handler.entry.entryId)}
      />
    </td>
  </>
  let entry_amount_field = <>
    <td
    id={IDs.entry_row_data_id('amount', state_handler.entry.entryId)}
    >
      <input
      type='text'
      onInput={(e) => {
        const amount: number = Number(e.currentTarget.value)
        startEntryUpdateTimer({amount})
      }}
      defaultValue={state_handler.entry.amount}
      id={IDs.entry_row_input_id('amount', state_handler.entry.entryId)}
      />
    </td>
  </>

  return <>{entry_name_field}{entry_amount_field}</>

  function startEntryUpdateTimer({
    name = state_handler.entry.name,
    amount = state_handler.entry.amount
  }
  : Partial<UserBudget.Entry> 
  ){
    let new_entry: UserBudget.Entry = {name, amount, entryId: state_handler.entry.entryId}
    state_handler.startEntryUpdateTimer(new_entry)
    props.categoryState.updateEntry(new_entry)
  }
}

function updateEntryAPI(entry: UserBudget.Entry): Promise<UserBudget.Entry | null>{
  console.log('Entry API update call:', entry)
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
      console.log('Entry API update failed: ', entry)
      return null;
    }
    let updated_entry: UserBudget.Entry = await response.json()
    console.log('Entry API update success', updated_entry)
    return updated_entry
  })
}

class EntryStateHandler{
  readonly entry: UserBudget.Entry
  setEntry: React.Dispatch<React.SetStateAction<UserBudget.Entry>>
  readonly entryUpdateTimer: NodeJS.Timeout | undefined
  setEntryUpdateTimer:  React.Dispatch<React.SetStateAction<NodeJS.Timeout | undefined>>
  readonly entryUpdatedByTimer: boolean
  setEntryUpdatedByTimer:  React.Dispatch<React.SetStateAction<boolean>>
  toast_context = useContext(ToastContext)

  constructor(entry: UserBudget.Entry){
    [this.entry, this.setEntry] = useState(entry);
    [this.entryUpdateTimer, this.setEntryUpdateTimer] = useState<NodeJS.Timeout>();
    [this.entryUpdatedByTimer, this.setEntryUpdatedByTimer] = useState<boolean>(false);
  }

  startEntryUpdateTimer(entry: UserBudget.Entry){
    console.log('EntryState: startEntryUpdateTimer', entry)
    this.setEntry(entry)
    clearTimeout(this.entryUpdateTimer)
    this.setEntryUpdatedByTimer(false)
    this.setEntryUpdateTimer(
      setTimeout(async () => {
        let updated_entry = await updateEntryAPI(entry)
        if(!updated_entry){
          this.toast_context?.popUp('Whoopsies')
        }
        this.setEntryUpdatedByTimer(true)
      }, 2000)
    )
  }
}

export {CategoryEntries, IDs}