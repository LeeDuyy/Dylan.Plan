// One-off data migration for US-022 (`docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/data-model.md` mục 6).
//
// Mỗi MonthBudget đang có được tạo đúng MỘT nguồn thu tên "Lương" với số tiền bằng
// giá trị cột `MonthBudget.income` cũ (con số cố định trước US-022), để "Thu nhập
// tháng" của các tháng lịch sử không bị về 0 (BR-037 chỉ áp cho tháng tạo mới).
//
// Idempotent: chỉ chèn cho MonthBudget chưa có IncomeSource nào — chạy lại nhiều
// lần không sinh trùng.
//
// Chạy: node prisma/backfill/us022-income-sources.mjs

import { fileURLToPath } from "node:url";
import path from "node:path";
import { randomUUID } from "node:crypto";

import Database from "better-sqlite3";

const scriptDir = path.dirname(fileURLToPath(import.meta.url)); // prisma/backfill
const dbPath = path.resolve(scriptDir, "..", "dev.db"); // prisma/dev.db

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

const months = db
  .prepare(
    `SELECT mb.id AS id, mb.income AS income
     FROM MonthBudget mb
     WHERE NOT EXISTS (SELECT 1 FROM IncomeSource src WHERE src.monthId = mb.id)`
  )
  .all();

const insert = db.prepare(
  `INSERT INTO IncomeSource (id, monthId, name, amount, "order", createdAt, updatedAt)
   VALUES (@id, @monthId, 'Lương', @amount, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
);

const run = db.transaction((rows) => {
  for (const row of rows) {
    insert.run({ id: `is_${randomUUID()}`, monthId: row.id, amount: row.income });
  }
});

run(months);

const total = db.prepare("SELECT COUNT(*) AS c FROM IncomeSource").get().c;
db.close();

console.log(
  `US-022 backfill: inserted ${months.length} "Lương" income source(s) for month(s) [${months
    .map((m) => m.id)
    .join(", ")}]. IncomeSource rows total: ${total}.`
);
