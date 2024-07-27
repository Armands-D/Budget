import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';
import * as argon2 from 'argon2'
import 'dotenv/config'

import { ApiError, UserBudget, Login, Database} from './data_types/MainApi';
import { sendApiError, Logger } from './functions/MainApi';

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

async function safeDBConnection(fun: (conenction: mysql.Connection) => Promise<void>){
  try{
    return DatabaseConnection()
    .then((connection: mysql.Connection) =>
      fun(connection).then(() => connection.end())
    )
  }catch(error: Error | unknown){
    console.log(error)
  }
}

async function authoriseUserToken(connection: mysql.Connection, token: string): Promise<boolean>{
  const log = Logger('authoriseUserToken')

  const decoded_token = Buffer.from(token, 'base64').toString()
  log('decoded: ', decoded_token)
  const [email, password] : (string)[] = decoded_token.split(':')
  return connection.query<mysql.RowDataPacket[]>(
    'SELECT * FROM main_db.user WHERE email = ?',
    [email]
  ).then((
    [results, fields]
    : [mysql.RowDataPacket[], mysql.FieldPacket[]]
  )=>{
    log('results: ', results)
    let user_details: Login.UserDetails = JSON.parse(JSON.stringify(results))[0] 
    return user_details.password === password
  })
}

app.use(cors({origin: "http://localhost:3000",credentials: true,}))
app.use(express.json())
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/user/:userId/budget/:budgetId', (req: Request, res: Response) => {
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  const log = Logger('GET/user/{userId}/budget/{budgetId}')

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

  safeDBConnection(async (connection: mysql.Connection)=>{
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

    await getAuthToken(connection, user_info)
  })
  // TODO: Make this work

  function validateLogin(
      result: mysql.RowDataPacket[],
      fields: mysql.FieldPacket[]
  ): ApiError | null {
    const log = Logger('validateLogin')

    log('Validate Login result:', result)
    if(!result.length) return Login.error_auth
    if(result.length > 1) return Login.error_multiple_users

    let user: Login.UserDetails = JSON.parse(JSON.stringify(result))[0]
    log('result_json', user)

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
    const log = Logger('getAuthToken')
    log('user: ', user)
    const token: string = Buffer.from(`${user.email}:${user.password}`).toString('base64')
    return connection.query<mysql.ProcedureCallPacket<mysql.RowDataPacket[]>>(
      "CALL main_db.refresh_auth_token(?, ?)",
      [user.userId, token]
    ).then(async(
      [[results, header], fields]
      : [[mysql.RowDataPacket[], mysql.ResultSetHeader], mysql.FieldPacket[]]
    )=>{
      console.log("results:", results, "header: ", header)
      res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        domain: "localhost",
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
      })
      res.send({token: token})
      log("User Auth", await authoriseUserToken(connection, token))
    })
  }
})

app.post('/create-token', (req, res)=>{
  res.send("Token")
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});