import { ApiError, missing_authorization_error, UserBudget, Login, Database} from '../data_types/MainApi';
import express, { Request, Response, Application} from 'express';
import * as mysql from 'mysql2/promise';

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
export function sendApiError(res: Response, api_error: ApiError){
  console.log(api_error)
  res.status(api_error.status)
    .send(api_error)
}

export function Logger(caller: string){
  return function log(...args: any){
    console.log(`[${caller}]:`, ...args)
  }
}

export async function safeDBConnection(
  fun: (connection: mysql.Connection) => Promise<any>,
): Promise<[result: any, error: null | ApiError]>
{
  const exception : ApiError = {
    error: "Server Error",
    status: 500,
    message: "Critical Internal Server Error"
  }
  try{
    var connection :mysql.Connection = await DatabaseConnection()
    var result: any= await fun(connection)
    connection.end()
    return [result?? null, null]
  }catch(error: Error | unknown){
    return [null, exception]
  }
}

export async function authoriseUserToken(connection: mysql.Connection, token: string): Promise<ApiError | null>{
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
    if (user_details.password === password) return null
    return {
      error: "Failed to authenticate user token",
      status: 401,
      message: "Error Unauthorized"
    }
  })
}
