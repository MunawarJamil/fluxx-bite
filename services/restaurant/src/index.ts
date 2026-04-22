import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect_db from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect_db();

app.listen(process.env.PORT, () => {
    console.log(`Restaurant service is running on port ${process.env.PORT}`);
});