import express, { Request, Response, Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as mysql from 'mysql2/promise';
import * as argon2 from 'argon2'
import 'dotenv/config'

import { ApiError, missing_authorization_error, UserBudget, Login, Database} from './data_types/MainApi';
import { safeDBConnection, sendApiError, Logger } from './functions/MainApi';
import { POST, PUT, GET } from './endpoints/Endpoints';

const app: Application = express();
const port : number = Number(process.env.PORT) || 3001;

app.use(cors({origin: "http://localhost:3000",credentials: true,}))
app.use(express.json())
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// TODO: Update Endpoint
// user/budget probably doesn't makes sense since user is verified through token
// /budget is fine
app.get('/user/:userId/budget/:budgetId', GET.userBudget)

app.post('/login', POST.loginUser)

app.post('/create-token', (req, res)=>{
  res.send("Token")
})

app.put('/entry/:entryId', PUT.entryUpdate)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});