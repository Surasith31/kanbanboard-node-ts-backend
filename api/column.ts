import express from "express";
import { conn } from "../connectdb";
import mysql from "mysql";
// import { columnPostRequst } from "../model/columnPostRequst";
export const router = express.Router();

export interface columnPostRequst {
  id: number;
  name: string;
  uid: number;
  task: task[];
}

export interface task {
  id: number;
  name: string;
  cid: number;
}

//get All coulumn by id user
router.get("/:id", (req, res) => {
  let id = req.params.id;

  conn.query(
    `SELECT c.id as column_id, c.name as column_name, c.uid, b.id as board_id, b.name as board_name, b.cid 
    FROM testwork_column c 
    LEFT JOIN testwork_task b ON c.id = b.cid 
    WHERE c.uid = ?`,
    [id],
    (err, results, fields) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Create a map to organize boards under their respective columns
      const columnsMap: { [key: number]: columnPostRequst } = {};

      results.forEach((row: any) => {
        const columnId = row.column_id;

        if (!columnsMap[columnId]) {
          columnsMap[columnId] = {
            id: columnId,
            name: row.column_name,
            uid: row.uid,
            task: [],
          };
        }

        if (row.board_id) {
          columnsMap[columnId].task.push({
            id: row.board_id,
            name: row.board_name,
            cid: row.cid,
          });
        }
      });

      // Convert map to an array
      const columnsWithBoards = Object.values(columnsMap);
      res.json(columnsWithBoards);
    }
  );
});

//get coulumn by id
router.get("/findby/:id", (req, res) => {
  let id = req.params.id;
  conn.query(
    "select * FROM testwork_column WHERE id =" + id,
    (err, result, fields) => {
      res.json(result);
    }
  );
});

//เพิ่ม column by id user
router.post("/", (req, res) => {
  let column: columnPostRequst = req.body;
  let sql = "INSERT INTO `testwork_column`(`name`, `uid`) VALUES (?,?)";
  sql = mysql.format(sql, [column.name, column.uid]);
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
  let sql = "DELETE FROM `testwork_column` WHERE id = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(202).json({ affected_row: result.affectedRows });
    }
  });
});

///แก้ไขชื่อ column
router.put("/:id", (req, res) => {
  let id = +req.params.id;
  let column: columnPostRequst = req.body;
  let sql = "update  `testwork_column` set `name`=? where `id`=?";
  sql = mysql.format(sql, [column.name, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});
