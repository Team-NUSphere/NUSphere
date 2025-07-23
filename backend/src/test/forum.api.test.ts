import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import forumRouter from '../routes/forum.js';
import type { Request, Response, NextFunction } from 'express';

const { 
  mockFindAll, 
  mockCreate, 
  mockFindByPk, 
  mockFindAndCountAll 
} = vi.hoisted(() => ({
  mockFindAll: vi.fn(),
  mockCreate: vi.fn(),
  mockFindByPk: vi.fn(),
  mockFindAndCountAll: vi.fn(),
}));

vi.mock('../db/models/ForumGroup.js', () => ({
  default: {
    findAll: mockFindAll,
    create: mockCreate,
    findByPk: mockFindByPk,
    findAndCountAll: mockFindAndCountAll,
  }
}));

const { mockPostFindAndCountAll, mockPostFindByPk } = vi.hoisted(() => ({
  mockPostFindAndCountAll: vi.fn(),
  mockPostFindByPk: vi.fn(),
}));

vi.mock('../db/models/Post.js', () => ({
  default: {
    findAndCountAll: mockPostFindAndCountAll,
    findByPk: mockPostFindByPk,
  }
}));

const { mockPostLikesFindAll } = vi.hoisted(() => ({
  mockPostLikesFindAll: vi.fn()
}));

vi.mock('../db/models/PostLikes.js', () => ({
  default: {
    findAll: mockPostLikesFindAll,
  }
}));

vi.mock('../db/models/Tags.js', () => ({
  default: {}
}));

vi.mock('../db/models/Comment.js', () => ({
  default: {}
}));

vi.mock('../db/models/CommentLikes.js', () => ({
  default: {}
}));

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = { 
    uid: 'test-user', 
    username: 'testuser',
    createOwnedGroup: vi.fn().mockResolvedValue({
      groupId: 'new-group-123',
      groupName: 'New Group',
      description: 'desc',
      postCount: 0,
      ownerId: 'test-user',
      createTag: vi.fn().mockResolvedValue({ name: 'test-tag' })
    })
  } as any;
  next();
};

const app = express();
app.use(express.json());
app.use(fakeAuth);
app.use('/forum', forumRouter);

describe('Forum API System Tests (DB Mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockFindAndCountAll.mockResolvedValue({ 
      count: 1, 
      rows: [
        { 
          groupId: 1, 
          groupName: 'Test Group', 
          description: 'desc', 
          postCount: 0, 
          ownerId: 'test-user',
          toJSON: () => ({ 
            groupId: 1, 
            groupName: 'Test Group', 
            description: 'desc', 
            postCount: 0, 
            ownerId: 'test-user' 
          }) 
        }
      ] 
    });
    
    mockPostFindAndCountAll.mockResolvedValue({ count: 0, rows: [] });
    mockPostLikesFindAll.mockResolvedValue([]);
  });

  it('GET /forum/groups should return group list', async () => {
    const res = await request(app).get('/forum/groups?page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('groupName');
    }
  });

  it('POST /forum/groups should create a group', async () => {
    const res = await request(app)
      .post('/forum/groups')
      .send({ 
        name: 'New Group', 
        description: 'A new test group',
        tags: ['test-tag']
      });
    
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('groupId');
  });

  it('GET /forum/group/:groupId should return group posts', async () => {
    mockFindByPk.mockResolvedValue({ 
      groupId: 1, 
      groupName: 'Test Group', 
      description: 'desc', 
      postCount: 0, 
      ownerId: 'test-user' 
    });
    
    const res = await request(app).get('/forum/group/1?q=&page=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('groupName', 'Test Group');
    expect(res.body).toHaveProperty('posts');
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it('GET /forum/group/:groupId with invalid id should return 404', async () => {
    mockFindByPk.mockResolvedValue(null);
    const res = await request(app).get('/forum/group/999?q=&page=1');
    expect(res.status).toBe(404);
  });

  it('GET /forum/posts should return all posts', async () => {
    const res = await request(app).get('/forum/posts?q=&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
