import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';
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
const DatabaseConnection = () :Promise<mysql.Connection> => {
  return  mysql.createConnection({
    host      : DB_HOST,
    port      : DB_PORT,
    user      : DB_USERNAME,
    password  : DB_PASSWORD
  });
}

app.use(cors({origin: "http://localhost:3000",credentials: true,}))
app.use(express.json())
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/user/:userId/budget/:budgetId', (req: Request, res: Response) => {
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
  // res.setHeader('Access-Control-Allow-Origin',  'http://localhost:3001/')
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
  // TODO: Check if valid email


  // connection.connect(function(err: mysql.QueryError | null ): void{
    // if (err) return sendApiError(res, Database.error_db_connect)

  try{
    DatabaseConnection()
    .then(async (connection : mysql.Connection) => {
      let [results, fields] : [mysql.RowDataPacket[], mysql.FieldPacket[]] =
        await connection.query<mysql.RowDataPacket[]>(
        `SELECT
        	u.username AS userName,
		      u.email,
          u.password,
		      u.id AS userId
        FROM main_db.user AS u
          WHERE email = ?`,
        [email]
      )

      let loginError: ApiError | null = validateLogin(results, fields)

      if(loginError) return sendApiError(res, loginError)
      
      let user_info : Login.UserDetails = JSON.parse(JSON.stringify(results))[0]

      getAuthToken(connection, user_info)
    })
  }catch(error: Error | unknown){
    console.log(error)
  }

    function validateLogin(
        result: mysql.RowDataPacket[],
        fields: mysql.FieldPacket[]
    ): ApiError | null {

      console.log('Validate Login result:', result)
      if(!result.length) return Login.error_auth
      if(result.length > 1) return Login.error_multiple_users

      let user: Login.UserDetails = JSON.parse(JSON.stringify(result))[0]
      console.log('result_json', user)

      if(!(password === user.password)) return Login.error_auth
      return null

      // return getAuthToken(user)

      // try{
      //   argon2.verify(
      //     // password
      //     '$argon2id$v=19$m=65536,t=3,p=4$cGFzc3dvcmQ$LL7xx04g0QX5dNIvbRdNXWMWchh8E8ZM4ZwMr/iSJqs',
      //     password,
      //   ).then((verified: boolean)=>{
      //     if(!verified) return sendApiError(res, Login.error_auth)
      //     res.send({token: "token"})
      //   })
      // }catch(e){
      //   console.error('--- Argon2Id Error')
      //   throw e
      // }
    }

    async function getAuthToken(connection: mysql.Connection, user: Login.UserDetails) {
      connection.query<mysql.ProcedureCallPacket<mysql.ResultSetHeader>>(
        "CALL main_db.refresh_auth_token(?)",
        [user.userId]
      ).then((
        [result, fields] : [mysql.ResultSetHeader, mysql.FieldPacket[]]
      )=>{
          let rows: mysql.RowDataPacket[] = result[0]
          let header: mysql.ResultSetHeader = result[1]
          console.log("GetAuthToken rows:", rows, "header: ", header)
          let user_details: Login.UserDetails = JSON.parse(JSON.stringify(rows[0]))
          res.cookie("token", user_details.token, {
            httpOnly: true,
            path: "/",
            domain: "localhost",
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60,
          })
          res.send({token: user_details.token})
      })
    }
  // })
})

app.post('/create-token', (req, res)=>{
  res.send("Token")
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});