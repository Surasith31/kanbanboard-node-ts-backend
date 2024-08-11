import express from "express";
import { UserPostRequest } from "../model/userPostRequest";
import { conn } from "../connectdb";
import mysql from "mysql";
export const router = express.Router();

//ค้นหา user by id
router.get("/:id", (req, res) => {
  let id = req.params.id;
  conn.query("select * FROM testwork_user WHERE id =" + id, (err, result, fields) => {
    res.json(result);
    // console.log(result);
    // console.log("ค้นหา user by id ");
  });
});

//เพิ่ม User เสร็จ
router.post("/register", (req, res) => {
  let user: UserPostRequest = req.body;
  let sql =
    "INSERT INTO `testwork_user`(`name`, `email`, `password`) VALUES (?,?,?)";
  sql = mysql.format(sql, [user.name, user.email, user.password]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(202)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

//login by email and password
router.post("/", (req, res) => {
  let user: UserPostRequest = req.body;
  console.log(user.email);
  console.log(user.password);
  conn.query(
    `select * FROM testwork_user WHERE email = "${user.email}"`,
    (err, resultEmail) => {
      if (resultEmail.length > 0) {
        conn.query(
          `select * FROM testwork_user WHERE email = "${user.email}" AND password = "${user.password}"`,
          (err, resultLogin) => {
            if (resultLogin.length > 0) {
              res.status(202).json(resultLogin);
            } else {
              res.status(402).json("รหัสไม่ถูก");
            }
          }
        );
      } else {
        ///ไม่เจอ email
        res.status(401).json("อีเมลไม่ถูก");
      }
    }
  );
});
