import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';

import { ApiError, missing_authorization_error, UserBudget, Login, Database} from '../../data_types/MainApi';
import { sendApiError, Logger } from '../../functions/MainApi';
import { safeDBConnection } from '../../functions/MainApi';

export async function userBudget(req: Request, res: Response){
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  const log = Logger(`${req.method.toUpperCase()} ${req.url}`)
  if(!(req.cookies && req.cookies.token)) return sendApiError(res, missing_authorization_error)

  let token: string = req.cookies.token
  log('token', token)
  res.send({good: 1})
  return
  const userId: number = Number(req.params.userId)
  const budgetId: number = Number(req.params.budgetId)
  if (Number.isNaN(userId) || Number.isNaN(budgetId)){
    let param_error : ApiError = {
      error: 'Client Error',
      status: 400,
      message: 'Invalid userId or budgetId, must be an integer.'
    }
    res.send(param_error)
    return
  }

  safeDBConnection(async(connection: mysql.Connection)=>{
    let [results, fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]]  =
      await connection.query(
        `CALL main_db.get_budget(?, ?);`,
        [userId, budgetId],
    )
    
    log('result:', results)
    log(JSON.parse(JSON.stringify(results))[1])

    let result_json : UserBudget.Results = JSON.parse(JSON.stringify(results))[0]

    let budget : UserBudget.Reponse = {id: budgetId, income: {}, expenses: {}}
    for (var row_index in result_json) {
      var row = result_json[row_index]
      let type : Record<string, UserBudget.Category> = row.type === 'INCOME' ? budget.income : budget.expenses
      let category_id: string = String(row.categoryId)
      if (! type.hasOwnProperty(category_id)) {
        type[category_id] = {
          name: row.category,
          entries: []
        }
      }
      let entry: UserBudget.Entry = {id: row.entryId, name: row.name, amount: row.amount}
      type[category_id].entries.push(entry)
    }

    log('transformed res: ', JSON.stringify(budget, null, 2))
    res.status(200).send(budget)
  })
}