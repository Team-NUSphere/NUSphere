import { format } from "date-fns";
import { RequestHandler } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const __dirname = import.meta.dirname;

const logEvents = async (message: string, fileName: string): Promise<void> => {
  const dateTime: string = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logId: string = uuid();
  const log = `${dateTime}\t${logId}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      log,
    );
  } catch (err) {
    console.log(err);
  }
};

const eventLogger: RequestHandler = (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  logEvents(
    `${req.method}\t${req.headers.origin ?? "unknown"}\t${req.url}`,
    "reqLog.txt",
  );
  console.log(`${req.method} ${req.path}`);
  next();
};
export { eventLogger, logEvents };
