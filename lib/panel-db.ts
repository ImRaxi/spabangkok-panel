import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function isPanelDbConfigured(): boolean {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE
  );
}

export function getPanelDbPool(): mysql.Pool | null {
  if (!isPanelDbConfigured()) return null;

  if (!pool) {
    const ssl =
      process.env.MYSQL_SSL === "true"
        ? { rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== "false" }
        : undefined;

    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT
        ? Number(process.env.MYSQL_PORT)
        : 3306,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 5),
      enableKeepAlive: true,
      ...(ssl && { ssl }),
    });
  }
  return pool;
}
