import { corsOptions } from "#configs/corsOptions.js";
import db from "#db/index.js";
import firebaseApp from "#firebase-admin.js";
import authMiddleware from "#middlewares/authHandler.js";
import errorHandler from "#middlewares/errorHandler.js";
import loginRouter from "#routes/login.js";
import moduleRouter from "#routes/module.js";
import registerRouter from "#routes/register.js";
import roomRouter from "#routes/room.js";
import userTimetableRouter from "#routes/userTimetable.js";
import { setupWebSocket } from "#ws-handler.js";
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

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

app.use("/", authMiddleware);

//routes
app.get("/", middleware);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/modules", moduleRouter);
app.use("/userTimetable", userTimetableRouter);
app.use("/room", roomRouter);

// 404 catch all
app.all("*name", (req, res, next) => {
  console.log("404 running");
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global error handler -> Logging
app.use(errorHandler);

//express
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const wss = new WebSocketServer({ noServer: true });

// web socket
export const { broadcastToRoom, getRoomForUser } = setupWebSocket(server, wss);
