import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';

import { ApiError, missing_authorization_error, UserBudget, Login, Database} from '../../data_types/MainApi';
import { sendApiError, Logger } from '../../functions/MainApi';
import { safeDBConnection, authoriseUserToken } from '../../functions/MainApi';

export async function userBudget(req: Request, res: Response){
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  const log = Logger(`${req.method.toUpperCase()} ${req.url}`)

  if(!(req.cookies && req.cookies.token)) return sendApiError(res, missing_authorization_error)
  let requestError: ApiError | null = validatRequest(req)
  if(requestError) return sendApiError(res, requestError)

  const token: string = req.cookies.token
  const userId: number = Number(req.params.userId)
  const budgetId: number = Number(req.params.budgetId)

  safeDBConnection(async(connection: mysql.Connection)=>{
    const authorise_error : ApiError | null = await authoriseUserToken(connection, token)
    if(authorise_error) return sendApiError(res, authorise_error)

    let [results, fields]: [mysql.RowDataPacket[], mysql.FieldPacket[]]  =
      await connection.query(
        `CALL main_db.get_budget(?, ?);`,
        [userId, budgetId],
    )
    
    log('result:', results)
    log(JSON.parse(JSON.stringify(results))[1])

    transformBudgetResults(budgetId, results)
    .then(budget => res.status(200).send(budget))
  })
}

function validatRequest(req: Request): ApiError | null{

  const userId: number = Number(req.params.userId)
  const budgetId: number = Number(req.params.budgetId)
  if (Number.isNaN(userId) || Number.isNaN(budgetId)){
    let param_error : ApiError = {
      error: 'Client Error',
      status: 400,
      message: 'Invalid userId or budgetId, must be an integer.'
    }
    return param_error
  }
  return null
}

async function transformBudgetResults(
  budgetId: number,
  results: mysql.RowDataPacket[]
):Promise<UserBudget.Reponse>
{
  let result_json : UserBudget.Results = JSON.parse(JSON.stringify(results))[0]

  let unique_income_categories : Record<number, UserBudget.Category> = {}
  let unique_expense_categories : Record<number, UserBudget.Category> = {}
  let income_total: number = 0
  let expense_total: number = 0

  for (var row_index in result_json) {
    var row = result_json[row_index]
    let category_id : number = row.categoryId
    let new_category : UserBudget.Category = {
      categoryId: category_id,
      name: row.category,
      total: 0,
      entries: []
    }
    
    let unique_type_category: Record<number, UserBudget.Category> =
      row.type === 'EXPENSE' ?
      unique_expense_categories : unique_income_categories

    if(!(category_id in unique_type_category)){
      unique_type_category[category_id] = new_category
    }
    let entry: UserBudget.Entry = {entryId: row.entryId, name: row.name, amount: Number(row.amount)}
    let current_category : UserBudget.Category = unique_type_category[category_id]

    current_category.total += entry.amount
    current_category.entries.push(entry)
    row.type === "EXPENSE" ? expense_total += entry.amount : income_total += entry.amount
  }

  return {
    budgetId: budgetId,
    income: {
      categories: Object.values(unique_income_categories),
      total: income_total
    },
    expenses: {
      categories: Object.values(unique_expense_categories),
      total: expense_total
    }
  }
}

