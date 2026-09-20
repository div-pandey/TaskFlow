import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Reading schema.sql...");
  let sql = fs.readFileSync(path.join(process.cwd(), "schema.sql"), "utf8");
  
  // Strip BOM if it exists
  if (sql.charCodeAt(0) === 0xFEFF) {
    sql = sql.slice(1);
  }
  
  // Split statements by semicolon
  const statements = sql
    .split(";")
    .map(stmt => {
      // Remove SQL comments and trim whitespace
      return stmt
        .split("\n")
        .filter(line => !line.trim().startsWith("--"))
        .join("\n")
        .trim();
    })
    .filter(stmt => stmt.length > 0);

  console.log(`Executing ${statements.length} SQL statements against Turso...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    try {
      await libsql.execute(stmt);
    } catch (error) {
      console.error(`Failed to execute statement:\n${stmt}\n`, error);
      process.exit(1);
    }
  }
  
  console.log("Schema successfully applied to Turso database!");
}

main();
