import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { addUser, getUserByUsername } from '../dbcon.js';

// JWT方式のログイン処理
export const jwtLogin = async (req, res) => {

};

// JWT方式の登録処理
export const jwtRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  try {
    const newUser = await addUser(username, password);

    //jwt生成
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: username
      },
      process.env.JWT_SECRET || 'fallback_secret',{
        expiresIn: '1h'
      }
    );

    //token返却
    res.status(201).json({
      message:'registered successfully',
      token: token,
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

};

// JWT方式のユーザー情報取得
export const getJwtUserInfo = (req, res) => {

};