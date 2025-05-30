import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to execute SQL queries
export async function executeQuery<T>({ query, values }: { query: string; values?: any[] }): Promise<T> {
  try {
    const [results] = await pool.execute(query, values);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function getRow<T>({ query, values }: { query: string; values?: any[] }): Promise<T | null> {
  try {
    const results = await executeQuery<T[]>({ query, values });
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to insert a row and return the inserted ID
export async function insertRow({ table, data }: { table: string; data: Record<string, any> }): Promise<number> {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(query, values);

    return (result as any).insertId;
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

// Helper function to update a row
export async function updateRow({
  table,
  data,
  where
}: {
  table: string;
  data: Record<string, any>;
  where: Record<string, any>
}): Promise<number> {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(data), ...Object.values(where)];

    const [result] = await pool.execute(query, values);

    return (result as any).affectedRows;
  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
}

// Helper function to delete a row
export async function deleteRow({
  table,
  where
}: {
  table: string;
  where: Record<string, any>
}): Promise<number> {
  try {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');

    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    const values = Object.values(where);

    const [result] = await pool.execute(query, values);

    return (result as any).affectedRows;
  } catch (error) {
    console.error('Database delete error:', error);
    throw error;
  }
}

export default {
  executeQuery,
  getRow,
  insertRow,
  updateRow,
  deleteRow
};
