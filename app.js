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
  resave: false,
  saveUninitialized: true,//未初期化セッションの保存
  cookie: {
    secure: false, // HTTPSでない場合はfalse
    maxAge: 1000 * 60 * 60 * 24, //ミリセコンド 1D
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