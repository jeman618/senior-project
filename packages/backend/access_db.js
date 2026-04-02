// packages/backend/access_db.js
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function sql(strings, ...values) {
  const client = await pool.connect();
  try {
    const text = strings.reduce((result, str, i) => {
      return result + str + (values[i] !== undefined ? `$${i + 1}` : "");
    }, "");
    const res = await client.query(text, values);
    return res.rows;
  } finally {
    client.release();
  }
}

export default sql;