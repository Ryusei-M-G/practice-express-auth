import express from 'express'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import cors from 'cors'

import { sessionLogin, sessionRegister, sessionLogout, getSessionInfo } from './controllers/sessionAuth.js';
import { jwtLogin, jwtRegister, jwtLogout, getJwtUserInfo } from './controllers/jwtAuth.js';

dotenv.config();

const app = express();

const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  },
}));

// セッション方式の認証エンドポイント
app.post('/session/login', sessionLogin);
app.post('/session/register', sessionRegister);
app.post('/session/logout', sessionLogout);
app.get('/session/profile', getSessionInfo);

// JWT方式の認証エンドポイント
app.post('/jwt/login', jwtLogin);
app.post('/jwt/register', jwtRegister);
app.post('/jwt/logout', jwtLogout);
app.get('/jwt/profile', getJwtUserInfo);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
