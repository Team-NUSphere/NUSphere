import { socketDataType } from "#controllers/userTimetableController.js";
import { firebaseAuth } from "#firebase-admin.js";
import { logEvents } from "#middlewares/eventLogger.js";
import { DecodedIdToken } from "firebase-admin/auth";
import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";

export interface AuthedWebSocket extends WebSocket {
  room: string;
  userId: string;
}

const rooms = new Map<string, Set<WebSocket>>();
const userToRoomAndSocket = new Map<
  string,
  { room: string; socket: WebSocket }
>();
const socketToUser = new Map<WebSocket, { room: string; userId: string }>();

export function broadcastToRoom(
  room: string,
  message: socketDataType,
  excludeUserId?: string,
) {
  const clients = rooms.get(room);
  if (!clients) return;

  for (const client of clients) {
    const userId = (client as AuthedWebSocket).userId;
    if (
      client.readyState === WebSocket.OPEN &&
      (!excludeUserId || userId !== excludeUserId)
    ) {
      client.send(JSON.stringify(message));
    }
  }
}

export function createRoom() {
  const randomRoomId = createRandomRoomId(6);
  if (!rooms.has(randomRoomId)) rooms.set(randomRoomId, new Set());
  return randomRoomId;
}

export function getRoomForUser(userId: string): null | string {
  return userToRoomAndSocket.get(userId)?.room ?? null;
}

export function setupWebSocket(server: Server, wss: WebSocketServer) {
  server.on("upgrade", (req, socket, head) => {
    void (async () => {
      socket.on("error", onSocketPreError);

      const url = new URL(
        req.url ?? "",
        `http://${req.headers.host ?? "localhost:3001"}`,
      );
      const userToken = url.searchParams.get("token");
      const room = url.searchParams.get("room");

      if (!userToken || !room) return socket.destroy();
      let uid: string;
      try {
        const user: DecodedIdToken =
          await firebaseAuth.verifyIdToken(userToken);
        uid = user.uid;
      } catch (error) {
        socket.destroy();
        if (error instanceof Error) onSocketPreError(error);
        else onSocketPreError(new Error("User token verification error"));
      }

      wss.handleUpgrade(req, socket, head, (wsRaw: WebSocket) => {
        const ws = wsRaw as AuthedWebSocket;
        ws.userId = uid;
        ws.room = room;
        wss.emit("connection", ws, req);
      });
    })();
  });

  wss.on("connection", (ws: AuthedWebSocket) => {
    ws.on("error", onSocketPostError);

    const { room, userId } = ws;
    terminateConnection(userId);
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room)?.add(ws);

    userToRoomAndSocket.set(userId, { room, socket: ws });
    socketToUser.set(ws, { room, userId });

    console.log(`User ${userId} connected to room ${room}`);

    ws.on("message", (msg) => {
      console.log(msg);
    });

    ws.on("close", () => {
      rooms.get(room)?.delete(ws);
      userToRoomAndSocket.delete(userId);
      socketToUser.delete(ws);
      if (rooms.get(room)?.size === 0) rooms.delete(room);
      console.log(`User ${userId} disconnected from room ${room}`);
    });
  });

  return { broadcastToRoom: broadcastToRoom, getRoomForUser: getRoomForUser };
}

function createRandomRoomId(length = 6) {
  for (let i = 0; i < 10; i++) {
    const randomRoomId = Math.random()
      .toString(36)
      .substring(2, length + 2);
    if (!rooms.has(randomRoomId)) return randomRoomId;
  }
  const fallBackId = Date.now().toString(36).slice(-length);
  return fallBackId;
}

function onSocketPostError(err: Error) {
  if (err instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents(`${err.name}: ${err.message}`, "errLog.txt");
    console.error(err.stack);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents("Error handling error", "ErrorHandlerError.txt");
  }
}

function onSocketPreError(err: Error) {
  if (err instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents(`${err.name}: ${err.message}`, "errLog.txt");
    console.error(err.stack);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logEvents("Error handling error", "ErrorHandlerError.txt");
  }
}

function terminateConnection(uid: string) {
  const entry = userToRoomAndSocket.get(uid);
  if (!entry) return;
  const { room, socket } = entry;
  const roomSet = rooms.get(room);
  if (!roomSet) return;
  roomSet.delete(socket);
  socketToUser.delete(socket);
  userToRoomAndSocket.delete(uid);
  if (socket.readyState === WebSocket.OPEN) socket.close();
}
