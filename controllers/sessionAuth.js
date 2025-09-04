import bcrypt from 'bcrypt';
import { addUser, getUserByUsername } from '../dbcon.js';

// セッション方式のログイン処理
export const sessionLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
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
};

// セッション方式の登録処理
export const sessionRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }
  try {
    await addUser(username, password);
    res.status(201).json({
      message: 'registered'
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// セッション方式のログアウト処理
export const sessionLogout = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'logout failed' });
      }
      return res.status(200).json({ message: 'logout successful' });
    });
  } else {
    res.status(400).json({ message: 'No active session' });
  }
};

// セッション情報取得
export const getSessionInfo = (req, res) => {
  if (req.session.user) {
    res.json({ message: `Logged in as ${req.session.user.username}` });
  } else {
    res.json({ message: 'You are not logged in' });
  }
};