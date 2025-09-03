import express from 'express'
import session from 'express-session';
import dotenv from 'dotenv'
import cors from'cors'

dotenv.config();

const app = express();

const port = 3000;

app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',//セッションIDの署名に使う秘密鍵
  resave: false,//変更がない限り保存しない
  saveUninitialized: true,//未初期化セッションの保存
  cookie: {
    httpOnly: true,//JSからアクセス不可
    secure: false, //httpsか
    maxAge: 1000 * 60 * 30, //ミリセコンド表記 30Min
  },
}));

app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.send(`<p>Views: ${req.session.views}</p>`);
  } else {
    req.session.views = 1;
    res.send('Welcome to the session demo. Refresh page!');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});