/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockBroadcastToRoom,
  mockGetRoomForUser,
  mockModuleFindByPk,
  mockModuleGetClasses,
  mockTimetableDeleteEvent,
  mockTimetableEditClasses,
  mockTimetableEditOrMakeEvent,
  mockTimetableGetAllClasses,
  mockTimetableGetAllEvents,
  mockTimetableGetAllModules,
  mockTimetableMakeNewEvent,
  mockTimetableRegisterNewModule,
  mockTimetableUnregisterModule,
  mockUserGetUserTimetable,
} = vi.hoisted(() => ({
  mockBroadcastToRoom: vi.fn(),
  mockGetRoomForUser: vi.fn(),
  mockModuleFindByPk: vi.fn(),
  mockModuleGetClasses: vi.fn(),
  mockTimetableDeleteEvent: vi.fn(),
  mockTimetableEditClasses: vi.fn(),
  mockTimetableEditOrMakeEvent: vi.fn(),
  mockTimetableGetAllClasses: vi.fn(),
  mockTimetableGetAllEvents: vi.fn(),
  mockTimetableGetAllModules: vi.fn(),
  mockTimetableMakeNewEvent: vi.fn(),
  mockTimetableRegisterNewModule: vi.fn(),
  mockTimetableUnregisterModule: vi.fn(),
  mockUserGetUserTimetable: vi.fn(),
}));

vi.mock("#db/models/Module.js", () => ({
  default: {
    findByPk: mockModuleFindByPk,
  },
}));

vi.mock("#ws-handler.js", () => ({
  broadcastToRoom: mockBroadcastToRoom,
  eventsToSocketEvents: vi.fn(),
  formatClassToSocketClass: vi.fn(),
  getRoomForUser: mockGetRoomForUser,
  modulesToSocketModules: vi.fn(),
}));

import * as userTimetableController from "../controllers/userTimetableController.js";

const createMockReq = (query?: any, params?: any, body?: any, user?: any) =>
  ({
    body: body ?? {},
    params: params ?? {},
    query: query ?? {},
    user: user,
  }) as any;

const createMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.sendStatus = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const next = vi.fn();

const mockTimetable = {
  deleteEvent: mockTimetableDeleteEvent,
  editClasses: mockTimetableEditClasses,
  editOrMakeEvent: mockTimetableEditOrMakeEvent,
  getAllClasses: mockTimetableGetAllClasses,
  getAllEvents: mockTimetableGetAllEvents,
  getAllModules: mockTimetableGetAllModules,
  makeNewEvent: mockTimetableMakeNewEvent,
  registerNewModule: mockTimetableRegisterNewModule,
  timetableId: "timetable123",
  uid: "user123",
  unregisterModule: mockTimetableUnregisterModule,
};

const mockUser = {
  getUserTimetable: mockUserGetUserTimetable,
  uid: "user123",
  username: "testuser",
};

const mockEvent = {
  date: "2024-01-15",
  description: "Test Description",
  endTime: "10:00",
  eventId: "event123",
  startTime: "09:00",
  title: "Test Event",
};

const mockModule = {
  faculty: "Computing",
  getClasses: mockModuleGetClasses,
  moduleCredit: 4,
  moduleId: "CS1010",
  title: "Programming Methodology",
};

const mockClass = {
  classId: "class123",
  classNo: "01",
  day: "Monday",
  endTime: "10:00",
  lessonType: "Lecture",
  moduleId: "CS1010",
  startTime: "09:00",
  venue: "LT1",
};

describe("User Timetable Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRoomForUser.mockReturnValue("room123");
  });

  describe("handleGetAllEvents", () => {
    it("should return all events for authenticated user", async () => {
      const req = createMockReq({}, {}, {}, mockUser);
      const res = createMockRes();

      const mockEvents = [mockEvent];
      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableGetAllEvents.mockResolvedValue(mockEvents);

      await userTimetableController.handleGetAllEvents(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableGetAllEvents).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEvents);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq();
      const res = createMockRes();

      await userTimetableController.handleGetAllEvents(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const req = createMockReq({}, {}, {}, mockUser);
      const res = createMockRes();
      const error = new Error("Database error");

      mockUserGetUserTimetable.mockRejectedValue(error);

      await userTimetableController.handleGetAllEvents(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleCreateNewEvent", () => {
    it("should create new event successfully", async () => {
      const req = createMockReq({}, {}, mockEvent, mockUser);
      const res = createMockRes();

      const createdEvent = { ...mockEvent, eventId: "newevent123" };
      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableMakeNewEvent.mockResolvedValue(createdEvent);

      await userTimetableController.handleCreateNewEvent(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableMakeNewEvent).toHaveBeenCalledWith(mockEvent);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "events",
          type: "create",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq({}, {}, mockEvent);
      const res = createMockRes();

      await userTimetableController.handleCreateNewEvent(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should handle timetable creation errors", async () => {
      const req = createMockReq({}, {}, mockEvent, mockUser);
      const res = createMockRes();
      const error = new Error("Creation failed");

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableMakeNewEvent.mockRejectedValue(error);

      await userTimetableController.handleCreateNewEvent(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleUpdateEvent", () => {
    it("should update event successfully", async () => {
      const req = createMockReq({}, {}, mockEvent, mockUser);
      const res = createMockRes();

      const updatedEvent = { ...mockEvent, title: "Updated Event" };
      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableEditOrMakeEvent.mockResolvedValue(updatedEvent);

      await userTimetableController.handleUpdateEvent(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableEditOrMakeEvent).toHaveBeenCalledWith(mockEvent);
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "events",
          type: "update",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq({}, {}, mockEvent);
      const res = createMockRes();

      await userTimetableController.handleUpdateEvent(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("handleDeleteEvent", () => {
    it("should delete event successfully", async () => {
      const req = createMockReq({ eventId: "event123" }, {}, {}, mockUser);
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleDeleteEvent(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableDeleteEvent).toHaveBeenCalledWith("event123");
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "events",
          eventId: "event123",
          type: "delete",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq({ eventId: "event123" });
      const res = createMockRes();

      await userTimetableController.handleDeleteEvent(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should handle inappropriate parameters", async () => {
      const req = createMockReq({}, {}, {}, mockUser);
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleDeleteEvent(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Inappropriate parameters in delete event request",
        }),
      );
    });

    it("should handle invalid eventId type", async () => {
      const req = createMockReq({ eventId: 123 }, {}, {}, mockUser);
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleDeleteEvent(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Inappropriate parameters in delete event request",
        }),
      );
    });
  });

  describe("handleRegisterModule", () => {
    it("should register module successfully", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" }, {}, mockUser);
      const res = createMockRes();

      const mockClasses = [mockClass];
      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockModuleFindByPk.mockResolvedValue(mockModule);
      mockTimetableRegisterNewModule.mockResolvedValue(mockClasses);

      await userTimetableController.handleRegisterModule(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockModuleFindByPk).toHaveBeenCalledWith("CS1010");
      expect(mockTimetableRegisterNewModule).toHaveBeenCalledWith("CS1010");
      expect(res.json).toHaveBeenCalledWith(mockClasses);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "modules",
          type: "create",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" });
      const res = createMockRes();

      await userTimetableController.handleRegisterModule(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should handle module not found", async () => {
      const req = createMockReq({}, { moduleCode: "INVALID" }, {}, mockUser);
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockModuleFindByPk.mockResolvedValue(null);

      await userTimetableController.handleRegisterModule(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No such module code: INVALID",
        }),
      );
    });

    it("should handle registration errors", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" }, {}, mockUser);
      const res = createMockRes();
      const error = new Error("Registration failed");

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockModuleFindByPk.mockResolvedValue(mockModule);
      mockTimetableRegisterNewModule.mockRejectedValue(error);

      await userTimetableController.handleRegisterModule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleUpdateClasses", () => {
    it("should update classes successfully", async () => {
      const req = createMockReq(
        { classNo: "01", lessonType: "Lecture" },
        { moduleCode: "CS1010" },
        {},
        mockUser,
      );
      const res = createMockRes();

      const updatedClasses = [{ ...mockClass, classNo: "02" }];
      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableEditClasses.mockResolvedValue(updatedClasses);

      await userTimetableController.handleUpdateClasses(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableEditClasses).toHaveBeenCalledWith(
        "CS1010",
        "Lecture",
        "01",
      );
      expect(res.json).toHaveBeenCalledWith(updatedClasses);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "classes",
          type: "update",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq(
        { classNo: "01", lessonType: "Lecture" },
        { moduleCode: "CS1010" },
      );
      const res = createMockRes();

      await userTimetableController.handleUpdateClasses(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should handle wrong format of query parameters", async () => {
      const req = createMockReq(
        { lessonType: "Lecture" },
        { moduleCode: "CS1010" },
        {},
        mockUser,
      );
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleUpdateClasses(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Wrong format of query parameters in handleUpdateClass",
        }),
      );
    });

    it("should handle invalid parameter types", async () => {
      const req = createMockReq(
        { classNo: "01", lessonType: 123 },
        { moduleCode: "CS1010" },
        {},
        mockUser,
      );
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleUpdateClasses(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Wrong format of query parameters in handleUpdateClass",
        }),
      );
    });
  });

  describe("handleDeleteModule", () => {
    it("should delete module successfully", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" }, {}, mockUser);
      const res = createMockRes();

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);

      await userTimetableController.handleDeleteModule(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableUnregisterModule).toHaveBeenCalledWith("CS1010");
      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room123",
        expect.objectContaining({
          dataType: "modules",
          moduleId: "CS1010",
          type: "delete",
          userId: "user123",
        }),
        "user123",
      );
    });

    it("should return 401 if user not authenticated", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" });
      const res = createMockRes();

      await userTimetableController.handleDeleteModule(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("No User Found");
    });

    it("should handle unregistration errors", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" }, {}, mockUser);
      const res = createMockRes();
      const error = new Error("Unregistration failed");

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableUnregisterModule.mockRejectedValue(error);

      await userTimetableController.handleDeleteModule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleGetAllUserModules", () => {
    it("should return all user modules and classes", async () => {
      const req = createMockReq({}, {}, {}, mockUser);
      const res = createMockRes();

      const mockModules = [mockModule];
      const mockClasses = [mockClass];

      mockUserGetUserTimetable.mockResolvedValue(mockTimetable);
      mockTimetableGetAllModules.mockResolvedValue(mockModules);
      mockTimetableGetAllClasses.mockResolvedValue(mockClasses);

      await userTimetableController.handleGetAllUserModules(req, res, next);

      expect(mockUserGetUserTimetable).toHaveBeenCalled();
      expect(mockTimetableGetAllModules).toHaveBeenCalled();
      expect(mockTimetableGetAllClasses).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        classes: expect.arrayContaining([
          expect.objectContaining({
            classId: mockClass.classId,
            moduleId: mockClass.moduleId,
          }),
        ]),
        modules: expect.arrayContaining([
          expect.objectContaining({
            moduleId: mockModule.moduleId,
            title: mockModule.title,
          }),
        ]),
      });
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq();
      const res = createMockRes();

      await userTimetableController.handleGetAllUserModules(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("handleGetClasses", () => {
    it("should return classes for module and lesson type", async () => {
      const req = createMockReq(
        {},
        { lessonType: "Lecture", moduleCode: "CS1010" },
        {},
        mockUser,
      );
      const res = createMockRes();

      const mockClasses = [mockClass];
      mockModuleFindByPk.mockResolvedValue(mockModule);
      mockModuleGetClasses.mockResolvedValue(mockClasses);

      await userTimetableController.handleGetClasses(req, res, next);

      expect(mockModuleFindByPk).toHaveBeenCalledWith("CS1010");
      expect(mockModuleGetClasses).toHaveBeenCalledWith({
        where: { lessonType: "Lecture" },
      });
      expect(res.json).toHaveBeenCalledWith(mockClasses);
    });

    it("should return 500 if user not authenticated", async () => {
      const req = createMockReq(
        {},
        { lessonType: "Lecture", moduleCode: "CS1010" },
      );
      const res = createMockRes();

      await userTimetableController.handleGetClasses(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it("should handle module not found", async () => {
      const req = createMockReq(
        {},
        { lessonType: "Lecture", moduleCode: "INVALID" },
        {},
        mockUser,
      );
      const res = createMockRes();

      mockModuleFindByPk.mockResolvedValue(null);

      await userTimetableController.handleGetClasses(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Module with code INVALID not found",
        }),
      );
    });

    it("should handle missing parameters", async () => {
      const req = createMockReq({}, { moduleCode: "CS1010" }, {}, mockUser);
      const res = createMockRes();

      await userTimetableController.handleGetClasses(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Module code or lesson type is missing",
        }),
      );
    });

    it("should handle database errors", async () => {
      const req = createMockReq(
        {},
        { lessonType: "Lecture", moduleCode: "CS1010" },
        {},
        mockUser,
      );
      const res = createMockRes();
      const error = new Error("Database error");

      mockModuleFindByPk.mockRejectedValue(error);

      await userTimetableController.handleGetClasses(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
