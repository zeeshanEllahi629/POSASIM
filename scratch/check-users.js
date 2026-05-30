const mariadb = require("mariadb");

async function main() {
  const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'foodefy_code'
  });

  let conn;
  try {
    console.log("Connecting directly via MariaDB driver...");
    conn = await pool.getConnection();
    console.log("Querying users...");
    const rows = await conn.query("SELECT id, name, email, role_id, type, password FROM users LIMIT 10");
    console.log("Total users found:", rows.length);
    rows.forEach(u => {
      console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role ID: ${u.role_id}, Type: ${u.type}, Password Hash: ${u.password}`);
    });
  } catch (err) {
    console.error("Failed to query database:", err);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

main();
