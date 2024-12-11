import { Pool } from 'pg';
import { config } from 'dotenv';

config();
const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT, DATABASE_URL } =
  process.env;
const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: Number(PGPORT),
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
