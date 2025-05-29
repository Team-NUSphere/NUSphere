import { corsOptions } from "#configs/corsOptions.js";
import cors from "cors";
import express from "express";

import { middleware } from "./middlewares.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.use(cors(corsOptions));

// parse data
app.use(express.json());
app.use(express.urlencoded());

//routes
app.get("/", middleware);

// 404 catch all
app.all("*", (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global error handler -> Logging
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
