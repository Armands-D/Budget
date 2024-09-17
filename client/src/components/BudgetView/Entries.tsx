
import React, { Fragment, useContext, useState }from 'react';
import {ApiError, UserBudget} from '../../data_types/MainApi'
import userEvent from '@testing-library/user-event';
import { ToastContext } from '../Toast/Toast';
import {CategoryState} from './Categories'
import { fetchAPI, Result } from '../../functions/ApiRequests';

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
    categoryState: CategoryState
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
      state_handler.updateEntryImmediate(state_handler.entry)
      props.categoryState.updateEntry(state_handler.entry)
    }}
    id={entry_row_id}
    className={'entry'}>
      {entry_row_data}
    </tr>
  </>
}

function EntryRowData(props: {
  entryStateHandler: EntryStateHandler,
  categoryState: CategoryState
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
        updateEntry({name})
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
        updateEntry({amount})
      }}
      defaultValue={state_handler.entry.amount}
      id={IDs.entry_row_input_id('amount', state_handler.entry.entryId)}
      />
    </td>
  </>

  return <>{entry_name_field}{entry_amount_field}</>

  function updateEntry({
    name = state_handler.entry.name,
    amount = state_handler.entry.amount
  }
  : Partial<UserBudget.Entry> 
  ){
    let new_entry: UserBudget.Entry = {name, amount, entryId: state_handler.entry.entryId}
    props.categoryState.updateEntry(new_entry)
    state_handler.startEntryApiUpdateTimer(new_entry)
  }
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

  startEntryApiUpdateTimer(entry: UserBudget.Entry){
    this.setEntry(entry)
    console.log('EntryState: startEntryUpdateTimer', this.entry)
    clearTimeout(this.entryUpdateTimer)
    this.setEntryUpdatedByTimer(false)
    this.setEntryUpdateTimer(
      setTimeout(async () => {
        let result = await this.sendEntryApiUpdate()
        if(!result.ok) this.toast_context?.popUp('Whoopsies')
        this.setEntryUpdatedByTimer(true)
      }, 2000)
    )
  }

  updateEntryImmediate(entry: UserBudget.Entry){
    this.setEntry(entry)
    clearTimeout(this.entryUpdateTimer)
    if(this.entryUpdatedByTimer) return // Avoid double update if timer alread updated
    this.sendEntryApiUpdate().then((result)=>{
      if(!result.ok) return this.toast_context?.popUp("Whoopsies")
    })
  }

  sendEntryApiUpdate(): Promise<Result<UserBudget.Entry, ApiError>>{
    console.log('Entry API update call:', this.entry)
    return fetchAPI(`http://localhost:3001/entry/${this.entry.entryId}`,{
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(this.entry),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
    .then((result: Result<UserBudget.Entry, ApiError>)=>{
      !result.ok ? 
        console.log('Entry API update failed: ', this.entry) :
        console.log('Entry API update success', )
      return result
    })
  }
}

export {CategoryEntries, IDs}