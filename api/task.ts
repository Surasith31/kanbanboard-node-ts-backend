import express from "express";
import { conn } from "../connectdb";
import mysql from "mysql";
import { taskPostRequst } from "../model/taskPostRequst";
export const router = express.Router();

//get All board by id column
router.get("/:id", (req, res) => {
  let id = req.params.id;
  conn.query(
    "select * FROM testwork_task WHERE cid =" + id,
    (err, result, fields) => {
      res.json(result);
    }
  );
});
//get board by id
router.get("/find/:id", (req, res) => {
  let id = req.params.id;
  conn.query(
    "select * FROM testwork_task WHERE id =" + id,
    (err, result, fields) => {
      res.json(result);
    }
  );
});

//เพิ่ม column by id user
router.post("/", (req, res) => {
  let column: taskPostRequst = req.body;
  let sql = "INSERT INTO `testwork_task`(`name`, `cid`) VALUES (?,?)";
  sql = mysql.format(sql, [column.name, column.cid]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(202)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

///ลบ column
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  let sql = "DELETE FROM `testwork_task` WHERE id=" + id;
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(202)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

///แก้ไขชื่อ task
router.put("/move/:id", (req, res) => {
  let id = +req.params.id;
  let column: taskPostRequst = req.body;
  let sql = "update  `testwork_task` set `cid`=? where `id`=?";
  sql = mysql.format(sql, [column.cid, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});

///แก้ไขชื่อ task
router.put("/:id", (req, res) => {
  let id = +req.params.id;
  let column: taskPostRequst = req.body;
  let sql = "update  `testwork_task` set `name`=? where `id`=?";
  sql = mysql.format(sql, [column.name, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});
