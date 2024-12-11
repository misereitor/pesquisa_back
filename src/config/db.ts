import { Pool } from 'pg';
import { config } from 'dotenv';

config();
const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;
const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: Number(PGPORT),
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
