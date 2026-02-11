// packages/proto/database.js
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export default sql;
