import { corsOptions } from "#configs/corsOptions.js";
import db from "#db/index.js";
import firebaseApp from "#firebase-admin.js";
import errorHandler from "#middlewares/errorHandler.js";
import loginRouter from "#routes/login.js";
import moduleRouter from "#routes/module.js";
import registerRouter from "#routes/register.js";
import cors from "cors";
import express from "express";

import { middleware } from "./middlewares.js";

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firebase = firebaseApp;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DB = db;
const port = process.env.PORT ?? "9001";

app.use(cors(corsOptions));

// parse data
app.use(express.json());
app.use(express.urlencoded());

//routes
app.get("/", middleware);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/modules", moduleRouter);

// 404 catch all
app.all("*name", (req, res, next) => {
  console.log("404 running");
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global error handler -> Logging
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
