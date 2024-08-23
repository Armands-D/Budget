import { Request, Response, Application} from 'express';
import { ApiError, EntryUpdate, missing_authorization_error, UserBudget, Login, Database} from '../../data_types/MainApi';
import { sendApiError, Logger } from '../../functions/MainApi';
import * as mysql from 'mysql2/promise';
import { safeDBConnection, authoriseUserToken } from '../../functions/MainApi';

async function entryUpdate(req: Request, res: Response){
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  console.log("Body: ", req.body)

  if(!validateBody(req.body)){
    res
      .status(EntryUpdate.body_validation_error.status)
      .send(EntryUpdate.body_validation_error)
  }
  
  var {name, amount} = req.body
  var entryId = Number(req.params.entryId)
  var entry : UserBudget.Entry = {entryId, name, amount}

  if(!validateEntry(entry)) res.send()

}

function validateBody(body: Request['body']){
  return (
    body.hasOwnProperty('name') &&
    body.hasOwnProperty('amount')
  )
}

function validateEntry(entry: UserBudget.Entry){
  const has_max_12digits_2precision: RegExp = new RegExp(
    "^\d{0,12}(\.\d{0,2})?$"
  )
  return (
    entry.name.length < 45 &&
    has_max_12digits_2precision.test(String(entry.amount))
  )
}

export {entryUpdate}