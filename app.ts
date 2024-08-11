import express from "express";
import { router as user } from "./api/user";
import { router as column } from "./api/column";
import { router as board } from "./api/task";
import cors from "cors";
import bodyParser from "body-parser";

export const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.use("/user", user);
app.use("/column", column);
app.use("/board", board);
