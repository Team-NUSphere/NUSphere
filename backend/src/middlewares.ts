import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res) => {
  res.send("Bye World!");
  console.log("Response sent");
};
