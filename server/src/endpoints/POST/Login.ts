import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';

import { ApiError, missing_authorization_error, UserBudget, Login, Database} from '../../data_types/MainApi';
import { sendApiError, Logger } from '../../functions/MainApi';
import { safeDBConnection, authoriseUserToken } from '../../functions/MainApi';

export async function loginUser (req: Request, res: Response){
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

  const email : string = String(req.body.email)
  const password : string = String(req.body.password)

  safeDBConnection(async (connection: mysql.Connection) =>{
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

    let loginError: ApiError | null = validateLoginResults(results, fields)
    if(loginError) return sendApiError(res, loginError)

    let user: Login.UserDetails = JSON.parse(JSON.stringify(results))[0]
    if(!(password === user.password)) return sendApiError(res, Login.error_auth)
    
    const token: string = await generateAuthToken(connection, user);
    sendAuthTokenCookie(res, token)
  })
}

function validateLoginResults(
  result: mysql.RowDataPacket[],
  fields: mysql.FieldPacket[]
):ApiError | null
{
  const log = Logger('validateLogin')

  log('result:', result)
  if(!result.length) return Login.error_auth
  if(result.length > 1) return Login.error_multiple_users

  return null
}

async function generateAuthToken(
  connection: mysql.Connection,
  user: Login.UserDetails
):Promise<string>
{
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
    log("results:", results, "header: ", header)
    return token
  })
}

async function sendAuthTokenCookie(
  res: Response,
  token: string
){
  const log = Logger('getAuthToken')
  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    domain: "localhost",
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  })
  res.send({token: token})
}