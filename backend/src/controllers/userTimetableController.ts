import User from "#db/models/User.js";
import { UserEventType } from "#db/models/UserEvents.js";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

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
    await userTimetable.makeNewEvent(event);
    res.status(200);
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
    await userTimetable.editOrMakeEvent(event);
    res.status(200);
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
    } else {
      throw new Error("Inappropriate parameters in delete event request");
    }
  } catch (error) {
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
    const classes = await userTimetable.registerNewModule(moduleCode);
    res.json(classes);
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
    res.sendStatus(500);
    return;
  }
  const userTimetable = await req.user.getUserTimetable();
  try {
    const moduleCode = req.params.moduleCode;
    await userTimetable.unregisterModule(moduleCode);
    res.status(200);
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
