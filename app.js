import express from 'express'
import session from 'express-session';
import dotenv from 'dotenv'
import cors from 'cors'
import { addUser, getUserByUsername } from './dbcon.js';

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (user && user.password === password) {
      req.session.user = {
        username: username
      };
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});


app.get('/', (req, res) => {
  if (req.session.user) {
    res.json({ message: `Logged in as ${req.session.user.username}` });
  } else {
    res.json({ message: 'You are not logged in' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' })
  }
  try {
    await addUser(username, password);
    res.status(201).json({
      message: 'registered'
    })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
