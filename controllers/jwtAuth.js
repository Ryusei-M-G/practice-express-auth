import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { addUser, getUserByUsername } from '../dbcon.js';

// JWT方式のログイン処理
export const jwtLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //jwt生成
    const token = jwt.sign(
      {
        userId: user.id,
        username: username
      },
      process.env.JWT_SECRET || 'fallback_secret',{
        expiresIn: '1h'
      }
    );

    //tokenをcookieに設定
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.status(200).json({
      message:'login successful',
      user: {username: username}
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'});
  }
};

// JWT方式の登録処理
export const jwtRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  try {
    const newUser = await addUser(username, password);

    res.status(201).json({
      message:'registered successfully. Please login.',
      user: {username: username}
    });
  }catch(error){
    if(error.code === '23505'){
      return res.status(409).json({message: 'Username already exists'});
    }
    console.error(error);
    res.status(500).json({message:'Internal server error'});
  }
};

// JWT方式のログアウト処理
export const jwtLogout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'logout successful' });
};

// JWT方式のユーザー情報取得
export const getJwtUserInfo = (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.status(200).json({
      message: 'User authenticated',
      user: {
        id: decoded.userId,
        username: decoded.username
      }
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};