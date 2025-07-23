/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextFunction, Request, Response } from "express";

import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import userTimetableRouter from "../routes/userTimetable.js";

const { mockModuleFindByPk, mockModuleGetClasses } = vi.hoisted(() => ({
  mockModuleFindByPk: vi.fn(),
  mockModuleGetClasses: vi.fn(),
}));

vi.mock("../db/models/Module.js", () => ({
  default: {
    findByPk: mockModuleFindByPk,
  },
}));

const {
  mockBroadcastToRoom,
  mockEventsToSocketEvents,
  mockFormatClassToSocketClass,
  mockGetRoomForUser,
  mockModulesToSocketModules,
} = vi.hoisted(() => ({
  mockBroadcastToRoom: vi.fn(),
  mockEventsToSocketEvents: vi.fn(),
  mockFormatClassToSocketClass: vi.fn(),
  mockGetRoomForUser: vi.fn(),
  mockModulesToSocketModules: vi.fn(),
}));

vi.mock("../ws-handler.js", () => ({
  broadcastToRoom: mockBroadcastToRoom,
  eventsToSocketEvents: mockEventsToSocketEvents,
  formatClassToSocketClass: mockFormatClassToSocketClass,
  getRoomForUser: mockGetRoomForUser,
  modulesToSocketModules: mockModulesToSocketModules,
}));

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    getUserTimetable: vi.fn().mockResolvedValue({
      deleteEvent: vi.fn().mockResolvedValue(true),
      editClasses: vi.fn().mockResolvedValue([
        {
          classId: "class-2",
          classNo: "02",
          day: "Tuesday",
          endTime: "11:00",
          lessonType: "Lecture",
          moduleId: "CS1010",
          startTime: "10:00",
          venue: "LT2",
        },
      ]),
      editOrMakeEvent: vi.fn().mockResolvedValue({
        endTime: "16:00",
        eventId: "updated-event-123",
        startTime: "15:00",
        title: "Updated Event",
      }),
      getAllClasses: vi.fn().mockResolvedValue([
        {
          classId: "class-1",
          classNo: "01",
          day: "Monday",
          endTime: "10:00",
          lessonType: "Lecture",
          moduleId: "CS1010",
          startTime: "09:00",
          venue: "LT1",
        },
      ]),
      getAllEvents: vi.fn().mockResolvedValue([
        {
          date: "2024-01-15",
          description: "Test Description",
          endTime: "10:00",
          eventId: "event-1",
          startTime: "09:00",
          title: "Test Event",
        },
      ]),
      getAllModules: vi.fn().mockResolvedValue([
        {
          faculty: "Computing",
          moduleCredit: 4,
          moduleId: "CS1010",
          title: "Programming Methodology",
        },
      ]),
      makeNewEvent: vi.fn().mockResolvedValue({
        date: "2024-01-16",
        endTime: "15:00",
        eventId: "new-event-123",
        startTime: "14:00",
        title: "New Event",
      }),
      registerNewModule: vi.fn().mockResolvedValue([
        {
          classId: "class-1",
          classNo: "01",
          day: "Monday",
          endTime: "10:00",
          lessonType: "Lecture",
          moduleId: "CS1010",
          startTime: "09:00",
          venue: "LT1",
        },
      ]),
      timetableId: "timetable-123",
      uid: "test-user-123",
      unregisterModule: vi.fn().mockResolvedValue(true),
    }),
    uid: "test-user-123",
    username: "testuser",
  } as any;
  next();
};

const app = express();
app.use(express.json());
app.use(fakeAuth);
app.use("/timetable", userTimetableRouter);

describe("User Timetable API System Tests (DB Mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetRoomForUser.mockReturnValue("room-test-user-123");
    mockEventsToSocketEvents.mockReturnValue([]);
    mockFormatClassToSocketClass.mockReturnValue({});
    mockModulesToSocketModules.mockReturnValue([]);
  });

  describe("Events API", () => {
    it("GET /timetable/events should return all user events", async () => {
      const res = await request(app).get("/timetable/events");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("eventId");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("startTime");
        expect(res.body[0]).toHaveProperty("endTime");
        expect(res.body[0]).toHaveProperty("date");
      }
    });

    it("POST /timetable/events should create a new event", async () => {
      const newEvent = {
        date: "2024-01-20",
        description: "CS1010 study session",
        endTime: "16:00",
        startTime: "14:00",
        title: "Study Session",
      };

      const res = await request(app).post("/timetable/events").send(newEvent);

      expect(res.status).toBe(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "events",
          type: "create",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("PUT /timetable/events should update an existing event", async () => {
      const updatedEvent = {
        date: "2024-01-20",
        description: "Updated description",
        endTime: "17:00",
        eventId: "event-1",
        startTime: "15:00",
        title: "Updated Study Session",
      };

      const res = await request(app)
        .put("/timetable/events")
        .send(updatedEvent);

      expect(res.status).toBe(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "events",
          type: "update",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("DELETE /timetable/events should delete an event", async () => {
      const res = await request(app)
        .delete("/timetable/events")
        .query({ eventId: "event-1" });

      expect([200, 204]).toContain(res.status);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "events",
          eventId: "event-1",
          type: "delete",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("DELETE /timetable/events should handle missing eventId", async () => {
      const res = await request(app).delete("/timetable/events");

      expect([400, 500]).toContain(res.status);
    });
  });

  describe("Modules API", () => {
    beforeEach(() => {
      mockModuleFindByPk.mockResolvedValue({
        faculty: "Computing",
        getClasses: mockModuleGetClasses,
        moduleCredit: 4,
        moduleId: "CS1010",
        title: "Programming Methodology",
      });

      mockModuleGetClasses.mockResolvedValue([
        {
          classId: "class-1",
          classNo: "01",
          day: "Monday",
          endTime: "10:00",
          lessonType: "Lecture",
          moduleId: "CS1010",
          startTime: "09:00",
          venue: "LT1",
        },
        {
          classId: "class-2",
          classNo: "02",
          day: "Tuesday",
          endTime: "11:00",
          lessonType: "Lecture",
          moduleId: "CS1010",
          startTime: "10:00",
          venue: "LT2",
        },
      ]);
    });

    it("GET /timetable/modules should return all user modules and classes", async () => {
      const res = await request(app).get("/timetable/modules");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("modules");
      expect(res.body).toHaveProperty("classes");
      expect(Array.isArray(res.body.modules)).toBe(true);
      expect(Array.isArray(res.body.classes)).toBe(true);

      if (res.body.modules.length > 0) {
        expect(res.body.modules[0]).toHaveProperty("moduleId");
        expect(res.body.modules[0]).toHaveProperty("title");
        expect(res.body.modules[0]).toHaveProperty("faculty");
        expect(res.body.modules[0]).toHaveProperty("moduleCredit");
      }

      if (res.body.classes.length > 0) {
        expect(res.body.classes[0]).toHaveProperty("classId");
        expect(res.body.classes[0]).toHaveProperty("moduleId");
        expect(res.body.classes[0]).toHaveProperty("day");
        expect(res.body.classes[0]).toHaveProperty("startTime");
        expect(res.body.classes[0]).toHaveProperty("endTime");
      }
    });

    it("POST /timetable/modules/:moduleCode should register a new module", async () => {
      const res = await request(app).post("/timetable/modules/CS1010");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "modules",
          type: "create",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("POST /timetable/modules/:moduleCode should handle invalid module code", async () => {
      mockModuleFindByPk.mockResolvedValue(null);

      const res = await request(app).post("/timetable/modules/INVALID");

      expect([400, 404, 500]).toContain(res.status);
    });

    it("PATCH /timetable/modules/:moduleCode should update classes", async () => {
      const res = await request(app)
        .patch("/timetable/modules/CS1010")
        .query({ classNo: "02", lessonType: "Lecture" });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "classes",
          type: "update",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("PATCH /timetable/modules/:moduleCode should handle missing query parameters", async () => {
      const res = await request(app)
        .patch("/timetable/modules/CS1010")
        .query({ lessonType: "Lecture" }); // Missing classNo

      expect([400, 500]).toContain(res.status);
    });

    it("PATCH /timetable/modules/:moduleCode should handle invalid parameter types", async () => {
      const res = await request(app)
        .patch("/timetable/modules/CS1010")
        .query({ lessonType: "lecture" });

      expect([400, 500]).toContain(res.status);
    });

    it("DELETE /timetable/modules/:moduleCode should unregister a module", async () => {
      const res = await request(app).delete("/timetable/modules/CS1010");

      expect(res.status).toBe(200);
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "modules",
          moduleId: "CS1010",
          type: "delete",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("GET /timetable/modules/:moduleCode/classes/:lessonType should return classes", async () => {
      const res = await request(app).get(
        "/timetable/modules/CS1010/classes/Lecture",
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(mockModuleFindByPk).toHaveBeenCalledWith("CS1010");
      expect(mockModuleGetClasses).toHaveBeenCalledWith({
        where: { lessonType: "Lecture" },
      });
    });

    it("GET /timetable/modules/:moduleCode/classes/:lessonType should handle invalid module", async () => {
      mockModuleFindByPk.mockResolvedValue(null);

      const res = await request(app).get(
        "/timetable/modules/INVALID/classes/Lecture",
      );

      expect([400, 404, 500]).toContain(res.status);
    });
  });

  describe("WebSocket Broadcasting", () => {
    it("should broadcast events on event creation", async () => {
      const newEvent = {
        date: "2024-01-15",
        endTime: "10:00",
        startTime: "09:00",
        title: "Test Event",
      };

      await request(app).post("/timetable/events").send(newEvent);

      expect(mockGetRoomForUser).toHaveBeenCalledWith("test-user-123");
      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "events",
          type: "create",
          userData: expect.any(Object),
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });

    it("should broadcast class changes on class updates", async () => {
      await request(app)
        .patch("/timetable/modules/CS1010")
        .query({ classNo: "02", lessonType: "Lecture" });

      expect(mockBroadcastToRoom).toHaveBeenCalledWith(
        "room-test-user-123",
        expect.objectContaining({
          dataType: "classes",
          type: "update",
          userId: "test-user-123",
        }),
        "test-user-123",
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      const fakeAuthWithError = (
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        req.user = {
          getUserTimetable: vi
            .fn()
            .mockRejectedValue(new Error("Database connection failed")),
          uid: "test-user-123",
        } as any;
        next();
      };

      const errorApp = express();
      errorApp.use(express.json());
      errorApp.use(fakeAuthWithError);
      errorApp.use("/timetable", userTimetableRouter);

      const res = await request(errorApp).get("/timetable/events");
      expect([500]).toContain(res.status);
    });

    it("should handle malformed request bodies", async () => {
      const res = await request(app)
        .post("/timetable/events")
        .send("invalid json string");

      expect([400, 500]).toContain(res.status);
    });

    it("should handle missing required fields", async () => {
      const incompleteEvent = {
        title: "Incomplete Event",
      };

      const res = await request(app)
        .post("/timetable/events")
        .send(incompleteEvent);

      expect([200, 400, 500]).toContain(res.status);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle event lifecycle: create → update → delete", async () => {
      const createRes = await request(app).post("/timetable/events").send({
        date: "2024-01-25",
        endTime: "16:00",
        startTime: "14:00",
        title: "Study Session",
      });
      expect(createRes.status).toBe(200);

      const updateRes = await request(app).put("/timetable/events").send({
        date: "2024-01-25",
        endTime: "18:00",
        eventId: "event-1",
        startTime: "14:00",
        title: "Extended Study Session",
      });
      expect(updateRes.status).toBe(200);

      const deleteRes = await request(app)
        .delete("/timetable/events")
        .query({ eventId: "event-1" });
      expect([200, 204]).toContain(deleteRes.status);

      expect(mockBroadcastToRoom).toHaveBeenCalledTimes(3);
    });
  });
});
