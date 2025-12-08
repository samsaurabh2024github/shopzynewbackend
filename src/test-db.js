import { pool } from "./config/db.js";

const testDB = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("MySQL Connected! Result:", rows[0].result);
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
};

testDB();
export default testDB;