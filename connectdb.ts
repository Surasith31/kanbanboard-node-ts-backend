import mysql from "mysql";
export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.210",
  user: "projcs66_1",
  password: "pR0jcs99",
  database: "projcs66_1",
});
