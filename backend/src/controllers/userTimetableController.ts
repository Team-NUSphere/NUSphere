import Class from "#db/models/Class.js";
import Module from "#db/models/Module.js";
import User from "#db/models/User.js";
import UserEvent, { UserEventType } from "#db/models/UserEvents.js";
import {
  broadcastToRoom,
  eventsToSocketEvents,
  formatClassToSocketClass,
  getRoomForUser,
  modulesToSocketModules,
  socketDataType,
} from "#ws-handler.js";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

function handleBroadcastToRoom({
  classes,
  dataType,
  eventId,
  events,
  moduleId,
  modules,
  type,
  userId,
  username,
}: {
  classes?: Class[];
  dataType: "classes" | "events" | "modules";
  eventId?: string;
  events?: UserEvent;
  moduleId?: string;
  modules?: Module;
  type: "create" | "delete" | "update";
  userId: string;
  username: string;
}) {
  const room = getRoomForUser(userId);
  if (!room) return;
  const socketEvent = events ? eventsToSocketEvents([events]) : undefined;
  const socketClasses = classes
    ? classes.map((lesson) => formatClassToSocketClass(lesson))
    : undefined;
  const socketModules = modules ? modulesToSocketModules([modules]) : undefined;
  const messageFormatted: socketDataType = {
    dataType: dataType,
    eventId: eventId,
    moduleId: moduleId,
    type: type,
    userData: {
      [userId]: {
        classes: socketClasses,
        events: socketEvent,
        modules: socketModules,
        username: username,
      },
    },
    userId: userId,
  };
  broadcastToRoom(room, messageFormatted, userId);
}

export const handleGetAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const user: User = req.user;
    const userTimetable = await user.getUserTimetable();
    const allEvents = await userTimetable.getAllEvents();
    res.json(allEvents);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleCreateNewEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const userTimetable = await req.user.getUserTimetable();
    const event: null | UserEventType = req.body as null | UserEventType;
    if (!event) throw new Error("No event found in request body");
    const userEvent = await userTimetable.makeNewEvent(event);
    res.sendStatus(200);

    handleBroadcastToRoom({
      dataType: "events",
      events: userEvent,
      type: "create",
      userId: req.user.uid,
      username: req.user.username,
    });
  } catch (error) {
    next(error);
  }
  return;
};

export const handleUpdateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const userTimetable = await req.user.getUserTimetable();
    const event: null | UserEventType = req.body as null | UserEventType;
    if (!event) throw new Error("No event found in request body");
    const userEvent = await userTimetable.editOrMakeEvent(event);
    res.sendStatus(200);

    handleBroadcastToRoom({
      dataType: "events",
      events: userEvent,
      type: "update",
      userId: req.user.uid,
      username: req.user.username,
    });
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const params = req.query;
    if (params.eventId && typeof params.eventId === "string") {
      const userTimetable = await req.user.getUserTimetable();
      await userTimetable.deleteEvent(params.eventId);

      handleBroadcastToRoom({
        dataType: "events",
        eventId: params.eventId,
        type: "delete",
        userId: req.user.uid,
        username: req.user.username,
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(400);
      throw new Error("Inappropriate parameters in delete event request");
    }
  } catch (error) {
    res.sendStatus(400);
    next(error);
  }
};

export const handleRegisterModule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  const userTimetable = await req.user.getUserTimetable();
  try {
    const moduleCode = req.params.moduleCode;
    const userModule = await Module.findByPk(moduleCode);
    if (!userModule) throw new Error(`No such module code: ${moduleCode}`);
    const classes = await userTimetable.registerNewModule(moduleCode);
    res.json(classes);

    handleBroadcastToRoom({
      classes: classes,
      dataType: "modules",
      modules: userModule,
      type: "create",
      userId: req.user.uid,
      username: req.user.username,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateClasses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  const userTimetable = await req.user.getUserTimetable();
  const lessonType = req.query.lessonType;
  const classNo = req.query.classNo;
  try {
    if (
      lessonType &&
      classNo &&
      typeof lessonType === "string" &&
      typeof classNo === "string"
    ) {
      const moduleCode = req.params.moduleCode;
      const classes = await userTimetable.editClasses(
        moduleCode,
        lessonType,
        classNo,
      );
      res.json(classes);

      handleBroadcastToRoom({
        classes: classes,
        dataType: "classes",
        type: "update",
        userId: req.user.uid,
        username: req.user.username,
      });
      return;
    }

    throw new Error("Wrong format of query parameters in handleUpdateClass");
  } catch (error) {
    next(error);
  }
};

export const handleDeleteModule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(401).send("No User Found");
    return;
  }
  const userTimetable = await req.user.getUserTimetable();
  try {
    const moduleCode = req.params.moduleCode;
    await userTimetable.unregisterModule(moduleCode);
    res.sendStatus(200);

    handleBroadcastToRoom({
      dataType: "modules",
      moduleId: moduleCode,
      type: "delete",
      userId: req.user.uid,
      username: req.user.username,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllUserModules = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  const userTimetable = await req.user.getUserTimetable();
  try {
    const allModules = (await userTimetable.getAllModules()).map((module) =>
      _.pick(module, "moduleId", "title", "faculty", "moduleCredit"),
    );
    const allClasses = (await userTimetable.getAllClasses()).map((lesson) =>
      _.pick(
        lesson,
        "classNo",
        "day",
        "endTime",
        "classId",
        "lessonType",
        "startTime",
        "venue",
        "weeks",
        "startDate",
        "endDate",
        "weekInterval",
        "moduleId",
      ),
    );
    res.json({
      classes: allClasses,
      modules: allModules,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetClasses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const moduleCode = req.params.moduleCode;
    const lessonType = req.params.lessonType;
    if (moduleCode && lessonType) {
      const module = await Module.findByPk(moduleCode);
      if (!module) {
        throw new Error(`Module with code ${moduleCode} not found`);
      }
      const classes = await module.getClasses({
        where: { lessonType: lessonType },
      });
      res.json(classes);
    } else {
      throw new Error("Module code or lesson type is missing");
    }
  } catch (error) {
    next(error);
  }
};
