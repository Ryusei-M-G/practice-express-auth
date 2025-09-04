import express from 'express'
import session from 'express-session';
import dotenv from 'dotenv'
import cors from'cors'

dotenv.config();

const app = express();

const port = 3000;

app.use(express.json());
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

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    // req.sessionに情報を保存することで、セッションが開始される
    req.session.user = { username: username };
    
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


app.get('/', (req, res) => {
  if (req.session.user) {
    res.json({ message: `Logged in as ${req.session.user.username}` });
  } else {
    res.json({ message: 'You are not logged in' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
