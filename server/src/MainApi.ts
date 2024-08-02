import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';
import * as argon2 from 'argon2'
import 'dotenv/config'

import { ApiError, missing_authorization_error, UserBudget, Login, Database} from './data_types/MainApi';
import { safeDBConnection, sendApiError, Logger } from './functions/MainApi';
import { POST } from './endpoints/Endpoints';

const app: Application = express();
const port : number = Number(process.env.PORT) || 3001;



app.use(cors({origin: "http://localhost:3000",credentials: true,}))
app.use(express.json())
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/user/:userId/budget/:budgetId', async (req: Request, res: Response) => {
  res.status(200).send({good: 1})
})

app.post('/login', async (req, res) => {
  POST.loginUser(req, res)
})

app.post('/create-token', (req, res)=>{
  res.send("Token")
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});