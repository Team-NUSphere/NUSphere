/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextFunction, Request, Response } from "express";

import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import forumRouter from "../routes/forum.js";

const { mockCreate, mockFindAll, mockFindAndCountAll, mockFindByPk } =
  vi.hoisted(() => ({
    mockCreate: vi.fn(),
    mockFindAll: vi.fn(),
    mockFindAndCountAll: vi.fn(),
    mockFindByPk: vi.fn(),
  }));

vi.mock("../db/models/ForumGroup.js", () => ({
  default: {
    create: mockCreate,
    findAll: mockFindAll,
    findAndCountAll: mockFindAndCountAll,
    findByPk: mockFindByPk,
  },
}));

const { mockPostFindAndCountAll, mockPostFindByPk } = vi.hoisted(() => ({
  mockPostFindAndCountAll: vi.fn(),
  mockPostFindByPk: vi.fn(),
}));

vi.mock("../db/models/Post.js", () => ({
  default: {
    findAndCountAll: mockPostFindAndCountAll,
    findByPk: mockPostFindByPk,
  },
}));

const { mockPostLikesFindAll } = vi.hoisted(() => ({
  mockPostLikesFindAll: vi.fn(),
}));

vi.mock("../db/models/PostLikes.js", () => ({
  default: {
    findAll: mockPostLikesFindAll,
  },
}));

vi.mock("../db/models/Tags.js", () => ({
  default: {},
}));

vi.mock("../db/models/Comment.js", () => ({
  default: {},
}));

vi.mock("../db/models/CommentLikes.js", () => ({
  default: {},
}));

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    createOwnedGroup: vi.fn().mockResolvedValue({
      createTag: vi.fn().mockResolvedValue({ name: "test-tag" }),
      description: "desc",
      groupId: "new-group-123",
      groupName: "New Group",
      ownerId: "test-user",
      postCount: 0,
    }),
    uid: "test-user",
    username: "testuser",
  } as any;
  next();
};

const app = express();
app.use(express.json());
app.use(fakeAuth);
app.use("/forum", forumRouter);

describe("Forum API System Tests (DB Mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFindAndCountAll.mockResolvedValue({
      count: 1,
      rows: [
        {
          description: "desc",
          groupId: 1,
          groupName: "Test Group",
          ownerId: "test-user",
          postCount: 0,
          toJSON: () => ({
            description: "desc",
            groupId: 1,
            groupName: "Test Group",
            ownerId: "test-user",
            postCount: 0,
          }),
        },
      ],
    });

    mockPostFindAndCountAll.mockResolvedValue({ count: 0, rows: [] });
    mockPostLikesFindAll.mockResolvedValue([]);
  });

  it("GET /forum/groups should return group list", async () => {
    const res = await request(app).get("/forum/groups?page=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("groupName");
    }
  });

  it("POST /forum/groups should create a group", async () => {
    const res = await request(app)
      .post("/forum/groups")
      .send({
        description: "A new test group",
        name: "New Group",
        tags: ["test-tag"],
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("groupId");
  });

  it("GET /forum/group/:groupId should return group posts", async () => {
    mockFindByPk.mockResolvedValue({
      description: "desc",
      groupId: 1,
      groupName: "Test Group",
      ownerId: "test-user",
      postCount: 0,
    });

    const res = await request(app).get("/forum/group/1?q=&page=1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("groupName", "Test Group");
    expect(res.body).toHaveProperty("posts");
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it("GET /forum/group/:groupId with invalid id should return 404", async () => {
    mockFindByPk.mockResolvedValue(null);
    const res = await request(app).get("/forum/group/999?q=&page=1");
    expect(res.status).toBe(404);
  });

  it("GET /forum/posts should return all posts", async () => {
    const res = await request(app).get("/forum/posts?q=&page=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
