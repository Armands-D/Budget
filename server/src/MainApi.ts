import express, { Request, Response, Application} from 'express';
import * as mysql from 'mysql2';
import 'dotenv/config'

import { ApiError, UserBudget} from './data_types/MainApi';

const app: Application = express();
const port : number = Number(process.env.PORT) || 3001;

const DB_PASSWORD : string = process.env.DB_PASSWORD || 'NULL'
const DB_USERNAME : string = process.env.DB_USERNAME || 'NULL'
const DB_HOST :string = process.env.DB_HOST || 'NULL'
const DB_PORT : number = Number(process.env.DB_PORT)

app.get('/', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello World');
});

app.get('/user/:userId/budget/:budgetId', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  let connection: mysql.Connection = mysql.createConnection({
    host      : DB_HOST,
    port      : DB_PORT,
    user      : DB_USERNAME,
    password  : DB_PASSWORD
  });

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
  
  connection.connect(function(err: mysql.QueryError | null):void{

    if (err) {
      console.error('error connecting: ' + err.stack)
      let connection_error : ApiError = {
        error: 'Client error',
        status: 400,
        message: 'Failed to Connect to DB'
      }
      res.send(connection_error)
      return
    }

    connection.query(
      `CALL main_db.get_budget(?, ?);`,
      [userId, budgetId],
      function (
        err: mysql.QueryError | null,
        result: mysql.QueryResult,
        fileds: mysql.FieldPacket[]
      ){

        if (err) throw err;
        console.log('result:', result)
        console.log(JSON.parse(JSON.stringify(result))[1])

        let result_json : UserBudget.Results = JSON.parse(JSON.stringify(result))[0]

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

        console.log('transformed res: ', JSON.stringify(budget, null, 2))
        res.status(200).send(budget)
      }
    )

    connection.end()
  });
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});