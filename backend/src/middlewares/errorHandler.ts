import { ErrorRequestHandler } from "express";

import { logEvents } from "./eventLogger.js";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents(`${err.name}: ${err.message}`, "errLog.txt");
    console.error(err.stack);
    res.status(500).send(err.message);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents("Error handling error", "ErrorHandlerError.txt");
  }
  next();
};

export default errorHandler;
