import express, { Request, Response, Application} from 'express';
import * as mysql from 'mysql2';
import * as argon2 from 'argon2'
import 'dotenv/config'

import { ApiError, UserBudget, Login, Database} from './data_types/MainApi';
import { sendApiError } from './functions/MainApi';

const app: Application = express();
const port : number = Number(process.env.PORT) || 3001;

const DB_PASSWORD : string = process.env.DB_PASSWORD || 'NULL'
const DB_USERNAME : string = process.env.DB_USERNAME || 'NULL'
const DB_HOST :string = process.env.DB_HOST || 'NULL'
const DB_PORT : number = Number(process.env.DB_PORT)
const DatabaseConnection = () :mysql.Connection => {
  return  mysql.createConnection({
    host      : DB_HOST,
    port      : DB_PORT,
    user      : DB_USERNAME,
    password  : DB_PASSWORD
  });
}
const DatabaseConnect = (
  ) :void => {
}

app.use(express.json()) 

app.get('/', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello World');
});

app.get('/user/:userId/budget/:budgetId', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.set({ 'content-type': 'application/json; charset=utf-8' });

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
  
  let connection: mysql.Connection = DatabaseConnection()
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

app.post('/login', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  console.log("Body: ", req.body)

  if(!(
    req.body &&
    req.body.hasOwnProperty('password') &&
    req.body.hasOwnProperty('email')
  )){
    sendApiError(res, Login.error_body)
    return
  }

  let email : string = String(req.body.email)
  let password : string = String(req.body.password)

  let connection: mysql.Connection = DatabaseConnection()

  connection.connect(function(err: mysql.QueryError | null ): void{
    if (err) return sendApiError(res, Database.error_db_connect)

    connection.query(
      "SELECT * FROM main_db.user WHERE email = ?",
      [email],
      validateLogin
    )

    function validateLogin(
        err: mysql.QueryError | null,
        result: mysql.RowDataPacket[][],
        fields: mysql.FieldPacket[]
    ){
      if(err) throw err

      console.log('result:', result)
      if(!result.length) return sendApiError(res, Login.error_auth)
      if(result.length > 1) return sendApiError(res, Login.error_multiple_users)

      let user: Login.UserDetails = JSON.parse(JSON.stringify(result))[0]
      console.log('result_json', user)

      try{
        argon2.verify(
          // password
          '$argon2id$v=19$m=65536,t=3,p=4$cGFzc3dvcmQ$LL7xx04g0QX5dNIvbRdNXWMWchh8E8ZM4ZwMr/iSJqs',
          password,
        ).then((verified: boolean)=>{
          if(!verified) return sendApiError(res, Login.error_auth)
          res.send({token: "token"})
        })
      }catch(e){
        console.error('--- Argon2Id Error')
        throw e
      }
    }
  })
})

app.post('/create-token', (req, res)=>{
  res.send("Token")
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});