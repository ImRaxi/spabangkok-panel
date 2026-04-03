import { createHash } from "node:crypto";

import type { RowDataPacket } from "mysql2";

import { getPanelDbPool } from "@/lib/panel-db";

function panelUsersTable(): string {
  const raw = process.env.PANEL_USERS_TABLE?.trim() || "panel_users";
  if (!/^[a-zA-Z0-9_]+$/.test(raw)) {
    throw new Error("PANEL_USERS_TABLE: dozwolone tylko litery, cyfry i _");
  }
  return raw;
}

/**
 * Jak w starym login.php: hasło porównywane z MD5(plain) z kolumną `password`.
 */
export async function verifyPanelUser(
  login: string,
  plainPassword: string
): Promise<RowDataPacket | null> {
  const pool = getPanelDbPool();
  if (!pool) return null;

  const passwordHash = createHash("md5")
    .update(plainPassword, "utf8")
    .digest("hex");

  const table = panelUsersTable();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM \`${table}\` WHERE login = ? AND password = ? LIMIT 1`,
    [login, passwordHash]
  );

  return rows[0] ?? null;
}
