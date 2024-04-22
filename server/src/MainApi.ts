import express, { Request, Response } from 'express';
import * as mysql from 'mysql2';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;

const DB_PASSWORD = process.env.DB_PASSWORD || 'NULL'
const DB_USERNAME = process.env.DB_USERNAME || 'NULL'
const DB_HOST = process.env.DB_HOST || 'NULL'
const DB_PORT = Number(process.env.DB_PORT)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/user', (req: Request, res: Response) => {
  let connection = mysql.createConnection({
    host      : DB_HOST,
    port      : DB_PORT,
    user      : DB_USERNAME,
    password  : DB_PASSWORD
  });
  
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
      'CALL main_db.get_users();',
      function(
        err: mysql.QueryError | null,
        result: mysql.QueryResult,
        fileds: mysql.FieldPacket[]
      ){
        if (err) throw err;
        console.log(result)
        res.send(result)
      }
    )
  });
})

interface ApiError{
  error: string
  status: number
  message: string
}