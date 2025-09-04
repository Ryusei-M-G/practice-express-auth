import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});


const addUser = async (username, password) => {
  const client = await pool.connect();
  try {
    // パラメータ化クエリを使用してSQLインジェクションを防ぐ
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
    const values = [username, password];

    const res = await client.query(query, values);
    console.log(`User ${username} added with id: ${res.rows[0].id}`);
    return res.rows[0];
  } catch (err) {
    console.error('Error adding user', err);
    throw err;
  } finally {
    // プールにクライアントを返却
    client.release();
  }

}

const getUserByUsername = async (username) => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await client.query(query, [username]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}
// 他のファイルから pool や addUser を使えるようにエクスポート
export { pool, addUser, getUserByUsername };
