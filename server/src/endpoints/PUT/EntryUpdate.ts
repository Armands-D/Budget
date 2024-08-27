import { Request, Response, Application} from 'express';
import { ApiError, EntryUpdate, missing_authorization_error, UserBudget, Login, Database} from '../../data_types/MainApi';
import { sendApiError, Logger } from '../../functions/MainApi';
import * as mysql from 'mysql2/promise';
import { safeDBConnection, authoriseUserToken } from '../../functions/MainApi';
import { error } from 'console';
import { send } from 'process';

async function entryUpdate(req: Request, res: Response){
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  console.log("Body: ", req.body)

  const invalid_request = validateRequest(req)
  if(invalid_request) return sendApiError(res, invalid_request)

  const entryId = Number(req.params.entryId)
  const {name, amount} = req.body

  safeDBConnection(async (connection: mysql.Connection)=>{
    var [results, fields] : [mysql.RowDataPacket[][], mysql.FieldPacket[]]
      = await connection.query<mysql.RowDataPacket[][]>(
        "CALL main_db.update_entry(?, ?, ?)",
        [entryId, name, amount]
      )
    const json_results = JSON.parse(JSON.stringify(results[0]))
    console.log(json_results)
    var updated_entry: UserBudget.Entry = json_results[0]
    return updated_entry
  })
  .then(async ([result, error])=>{
    if(error) return sendApiError(res, error)
    console.log(result)
    res.send(result)
  })
}

function validateRequest(req: Request): ApiError | null{
  var entryId = Number(req.params.entryId)
  if(Number.isNaN(entryId))
    EntryUpdate.uri_param_error

  if (!validateBody(req.body))
    return EntryUpdate.body_validation_error

  var {name, amount} = req.body
  var entry : UserBudget.Entry = {entryId, name, amount}
  if(!validateEntry(entry))
    return EntryUpdate.entry_validation_error

  return null
}

function validateBody(body: Request['body']){
  return (
    body.hasOwnProperty('name') &&
    body.hasOwnProperty('amount')
  )
}

function validateEntry(entry: UserBudget.Entry){
  const has_alpha_num_special_max45: RegExp = new RegExp(
    /^[a-zA-Z\d( \-!\(\))]{0,45}$/
  )
  const has_max_12digits_2precision: RegExp = new RegExp(
    /^\d{0,12}(\.\d{0,2})?$/
  )
  return (
    has_alpha_num_special_max45.test(entry.name) &&
    has_max_12digits_2precision.test(String(entry.amount))
  )
}

export {entryUpdate}