import { createRoom } from "#ws-handler.js";
import { NextFunction, Request, Response } from "express";

const handleCreateRoom = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  const roomId = createRoom();
  res.send(roomId);
};

export default handleCreateRoom;
