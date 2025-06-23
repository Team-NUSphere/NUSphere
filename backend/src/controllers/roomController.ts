import { createRoom } from "#ws-handler.js";
import { Request, Response } from "express";

const handleCreateRoom = (req: Request, res: Response): void => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  const roomId = createRoom();
  res.send(roomId);
};

export default handleCreateRoom;
