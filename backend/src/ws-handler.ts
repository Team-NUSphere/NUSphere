import Class from "#db/models/Class.js";
import Module from "#db/models/Module.js";
import User from "#db/models/User.js";
import UserEvent from "#db/models/UserEvents.js";
import UserTimetable from "#db/models/UserTimetable.js";
import { firebaseAuth } from "#firebase-admin.js";
import { logEvents } from "#middlewares/eventLogger.js";
import { DecodedIdToken } from "firebase-admin/auth";
import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";

export interface AuthedWebSocket extends WebSocket {
  room: string;
  userId: string;
}
export interface socketDataType {
  dataType?: "classes" | "events" | "modules";
  eventId?: string; // for delete events
  moduleId?: string; // for delete modules
  type: "add" | "create" | "delete" | "init" | "remove" | "update";
  userData?: Record<
    string,
    {
      classes?: UserClassType[];
      events?: UserEventsType;
      modules?: UserModulesType;
    }
  >;
  userId?: string; // for remove and delete operations
}
interface modInfo {
  faculty: string;
  moduleCredit: number;
  moduleId: string;
  title: string;
}
interface UserClassType {
  classId: number;
  classNo: string;
  day: string;
  endDate?: string;
  endTime: string;
  lessonType: string;
  moduleId: string;
  startDate?: string;
  startTime: string;
  venue: string;
  weekInterval?: number;
  weeks?: number[];
}
type UserEventsType = Record<string, UserEventType>;
interface UserEventType {
  day: string;
  description?: string;
  endTime: string;
  eventId: string;
  name: string;
  startTime?: string;
  venue?: string;
  weeks?: number[];
}

type UserModulesType = Record<string, modInfo>;

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

    getFullEventClassModule(userId)
      .then((data) => {
        if (!data) return;
        broadcastToRoom(
          room,
          {
            type: "add",
            userData: {
              [userId]: data,
            },
          },
          userId,
        );
      })
      .catch((error: unknown) => {
        console.log(error);
      });

    getAllInRoomEventClassModule(userId, room)
      .then((data) => {
        if (!data) return;
        ws.send(
          JSON.stringify({
            type: "init",
            userData: data,
          } as socketDataType),
        );
      })
      .catch((error: unknown) => {
        console.log(error);
      });

    ws.on("message", (msg) => {
      console.log(msg);
    });

    ws.on("close", () => {
      rooms.get(room)?.delete(ws);
      userToRoomAndSocket.delete(userId);
      socketToUser.delete(ws);
      if (rooms.get(room)?.size === 0) rooms.delete(room);
      console.log(`User ${userId} disconnected from room ${room}`);
      broadcastToRoom(
        room,
        {
          type: "remove",
          userId: userId,
        },
        userId,
      );
    });
  });

  return { broadcastToRoom: broadcastToRoom, getRoomForUser: getRoomForUser };
}

function classToSocketClass(classes: Class[]) {
  const socketClass: UserClassType[] = classes.map((lesson) => ({
    classId: lesson.classId,
    classNo: lesson.classNo,
    day: lesson.day,
    endDate: lesson.endDate,
    endTime: lesson.endTime,
    lessonType: lesson.lessonType,
    moduleId: lesson.moduleId,
    startDate: lesson.startDate,
    startTime: lesson.startTime,
    venue: lesson.venue,
    weekInterval: lesson.weekInterval,
    weeks: lesson.weeks,
  }));
  return socketClass;
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

function eventToSocketEvent(events: UserEvent[]) {
  const socketEvent: UserEventsType = {};
  for (const event of events) {
    socketEvent[event.eventId] = {
      day: event.day,
      description: event.description,
      endTime: event.endTime,
      eventId: event.eventId,
      name: event.name,
      startTime: event.startTime,
      venue: event.venue,
      weeks: event.weeks,
    };
  }
  return socketEvent;
}

async function getAllInRoomEventClassModule(
  excludeUserId: string,
  room: string,
) {
  const clients = rooms.get(room);
  if (!clients) return;
  const returnData: Record<
    string,
    {
      classes: UserClassType[];
      events: UserEventsType;
      modules: UserModulesType;
    }
  > = {};

  for (const client of clients) {
    const userId = (client as AuthedWebSocket).userId;
    if (!excludeUserId || userId !== excludeUserId) {
      const userData = await getFullEventClassModule(userId);
      if (!userData) continue;
      returnData[userId] = userData;
    }
  }

  return returnData;
}

async function getFullEventClassModule(userId: string) {
  const userTimetable = (
    await User.findByPk(userId, {
      include: [
        {
          as: "Timetable",
          model: UserTimetable,
        },
      ],
    })
  )?.Timetable;
  if (!userTimetable) return;
  const allClasses = await userTimetable.getAllClasses();
  const allEvents = await userTimetable.getAllEvents();
  const allModules = await userTimetable.getAllModules();
  return {
    classes: classToSocketClass(allClasses),
    events: eventToSocketEvent(allEvents),
    modules: moduleToSocketModule(allModules),
  };
}

function moduleToSocketModule(mods: Module[]) {
  const socketModule: UserModulesType = {};
  for (const mod of mods) {
    socketModule[mod.moduleId] = {
      faculty: mod.faculty,
      moduleCredit: mod.moduleCredit,
      moduleId: mod.moduleId,
      title: mod.title,
    };
  }
  return socketModule;
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
