import express, { Request, Response } from 'express';
import * as mysql from 'mysql2';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3001;

const DB_PASSWORD = process.env.DB_PASSWORD || 'NULL'
const DB_USERNAME = process.env.DB_USERNAME || 'NULL'
const DB_HOST = process.env.DB_HOST || 'NULL'
const DB_PORT = Number(process.env.DB_PORT)

app.get('/', (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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
        console.log(result)
        res.status(200).send(JSON.parse(JSON.stringify(result))[0])
      }
    )

    connection.end()
  });
})

interface ApiError{
  error: string
  status: number
  message: string
}
