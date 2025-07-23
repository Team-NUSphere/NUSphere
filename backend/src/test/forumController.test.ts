import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockForumGroupFindAndCountAll,
  mockForumGroupFindByPk,
  mockForumGroupCreate,
  mockForumGroupDestroy,
  mockPostFindAndCountAll,
  mockPostFindByPk,
  mockPostCreate,
  mockPostDestroy,
  mockCommentFindByPk,
  mockCommentCreate,
  mockCommentDestroy,
  mockCommentUpdate,
  mockPostLikesFindAll,
  mockCommentLikesFindAll,
  mockUserCreateOwnedGroup,
  mockUserGetOwnedGroups,
  mockUserGetPosts,
  mockUserGetComments,
  mockUserLikeNewPost,
  mockUserUnlikePost,
  mockUserLikeNewComment,
  mockUserUnlikeComment,
  mockTagsFindOne,
  mockPostTagAddNewTag,
  mockGroupGetTags,
  mockGroupCreateTag,
  mockGroupCreatePost,
  mockGroupIncrement,
  mockGroupDecrement,
  mockPostGetForumGroup,
  mockPostAddNewTag,
  mockPostGetTags,
  mockPostRemoveTags,
  mockPostIncrement,
  mockPostDecrement,
  mockCommentGetReplies,
  mockCommentCreateReply,
  mockCommentIncrement,
  mockCommentDecrement,
  mockPostGetReplies,
  mockPostCreateReply
} = vi.hoisted(() => ({
  mockForumGroupFindAndCountAll: vi.fn(),
  mockForumGroupFindByPk: vi.fn(),
  mockForumGroupCreate: vi.fn(),
  mockForumGroupDestroy: vi.fn(),
  mockPostFindAndCountAll: vi.fn(),
  mockPostFindByPk: vi.fn(),
  mockPostCreate: vi.fn(),
  mockPostDestroy: vi.fn(),
  mockCommentFindByPk: vi.fn(),
  mockCommentCreate: vi.fn(),
  mockCommentDestroy: vi.fn(),
  mockCommentUpdate: vi.fn(),
  mockPostLikesFindAll: vi.fn(),
  mockCommentLikesFindAll: vi.fn(),
  mockUserCreateOwnedGroup: vi.fn(),
  mockUserGetOwnedGroups: vi.fn(),
  mockUserGetPosts: vi.fn(),
  mockUserGetComments: vi.fn(),
  mockUserLikeNewPost: vi.fn(),
  mockUserUnlikePost: vi.fn(),
  mockUserLikeNewComment: vi.fn(),
  mockUserUnlikeComment: vi.fn(),
  mockTagsFindOne: vi.fn(),
  mockPostTagAddNewTag: vi.fn(),
  mockGroupGetTags: vi.fn(),
  mockGroupCreateTag: vi.fn(),
  mockGroupCreatePost: vi.fn(),
  mockGroupIncrement: vi.fn(),
  mockGroupDecrement: vi.fn(),
  mockPostGetForumGroup: vi.fn(),
  mockPostAddNewTag: vi.fn(),
  mockPostGetTags: vi.fn(),
  mockPostRemoveTags: vi.fn(),
  mockPostIncrement: vi.fn(),
  mockPostDecrement: vi.fn(),
  mockCommentGetReplies: vi.fn(),
  mockCommentCreateReply: vi.fn(),
  mockCommentIncrement: vi.fn(),
  mockCommentDecrement: vi.fn(),
  mockPostGetReplies: vi.fn(),
  mockPostCreateReply: vi.fn()
}));

vi.mock('#db/models/ForumGroup.js', () => ({
  default: {
    findAndCountAll: mockForumGroupFindAndCountAll,
    findByPk: mockForumGroupFindByPk,
    create: mockForumGroupCreate
  }
}));

vi.mock('#db/models/Post.js', () => ({
  default: {
    findAndCountAll: mockPostFindAndCountAll,
    findByPk: mockPostFindByPk,
    create: mockPostCreate
  }
}));

vi.mock('#db/models/Comment.js', () => ({
  default: {
    findByPk: mockCommentFindByPk,
    create: mockCommentCreate,
    destroy: mockCommentDestroy,
    update: mockCommentUpdate
  }
}));

vi.mock('#db/models/PostLikes.js', () => ({
  default: {
    findAll: mockPostLikesFindAll
  }
}));

vi.mock('#db/models/CommentLikes.js', () => ({
  default: {
    findAll: mockCommentLikesFindAll
  }
}));

vi.mock('#db/models/Tags.js', () => ({
  default: {
    findOne: mockTagsFindOne
  }
}));

vi.mock('#db/models/PostTag.js', () => ({
  default: {
    addNewTag: mockPostTagAddNewTag
  }
}));

import * as forumController from '../controllers/forumController.js';

const createMockReq = (query?: any, params?: any, body?: any, user?: any) => ({
  query: query || {},
  params: params || {},
  body: body || {},
  user: user
} as any);

const createMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.sendStatus = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const next = vi.fn();

const mockUser = {
  uid: 'user123',
  username: 'testuser',
  createOwnedGroup: mockUserCreateOwnedGroup,
  getOwnedGroups: mockUserGetOwnedGroups,
  getPosts: mockUserGetPosts,
  getComments: mockUserGetComments,
  likeNewPost: mockUserLikeNewPost,
  unlikePost: mockUserUnlikePost,
  likeNewComment: mockUserLikeNewComment,
  unlikeComment: mockUserUnlikeComment
};

const mockGroup = {
  groupId: 'group123',
  groupName: 'Test Group',
  description: 'Test Description',
  postCount: 5,
  ownerId: 'user123',
  getTags: mockGroupGetTags,
  createTag: mockGroupCreateTag,
  createPost: mockGroupCreatePost,
  increment: mockGroupIncrement,
  decrement: mockGroupDecrement,
  destroy: mockForumGroupDestroy,
  updateGroup: vi.fn()
};

const mockGetGroupName = vi.fn();

const mockPost = {
  postId: 'post123',
  title: 'Test Post',
  details: 'Test Details',
  groupId: 'group123',
  uid: 'user123',
  likes: 10,
  replies: 3,
  views: 100,
  createdAt: new Date(),
  isLiked: false,
  groupName: 'Test Group',
  getForumGroup: mockPostGetForumGroup,
  getGroupName: mockGetGroupName,
  addNewTag: mockPostAddNewTag,
  getTags: mockPostGetTags,
  removeTags: mockPostRemoveTags,
  increment: mockPostIncrement,
  decrement: mockPostDecrement,
  destroy: mockPostDestroy,
  updatePost: vi.fn(),
  getReplies: mockPostGetReplies,
  createReply: mockPostCreateReply
};

mockGetGroupName.mockResolvedValue(mockPost);

const mockComment = {
  commentId: 'comment123',
  comment: 'Test Comment',
  uid: 'user123',
  parentId: 'post123',
  parentType: 'ParentPost',
  likes: 5,
  replies: 2,
  isLiked: false,
  createdAt: new Date(),
  toJSON: vi.fn().mockReturnValue({ commentId: 'comment123', comment: 'Test Comment' }),
  getReplies: mockCommentGetReplies,
  createReply: mockCommentCreateReply,
  increment: mockCommentIncrement,
  decrement: mockCommentDecrement,
  destroy: mockCommentDestroy,
  update: mockCommentUpdate
};

describe('Forum Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleGetGroupList', () => {
    it('should handle database errors', async () => {
      const req = createMockReq({ page: '1' });
      const res = createMockRes();
      const error = new Error('Database error');

      mockForumGroupFindAndCountAll.mockRejectedValue(error);

      await forumController.handleGetGroupList(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('handleGetGroup', () => {
    it('should return group when found', async () => {
      const req = createMockReq({}, { groupId: 'group123' });
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);

      await forumController.handleGetGroup(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(res.json).toHaveBeenCalledWith(mockGroup);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle group not found', async () => {
      const req = createMockReq({}, { groupId: 'nonexistent' });
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(null);

      await forumController.handleGetGroup(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const req = createMockReq({}, { groupId: 'group123' });
      const res = createMockRes();
      const error = new Error('Database error');

      mockForumGroupFindByPk.mockRejectedValue(error);

      await forumController.handleGetGroup(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleCreateGroup', () => {
    it('should create group with valid data', async () => {
      const req = createMockReq({}, {}, {
        name: 'New Group',
        description: 'New Description',
        tags: ['tag1', 'tag2']
      }, mockUser);
      const res = createMockRes();

      const createdGroup = { ...mockGroup, groupId: 'newgroup123' };
      mockUserCreateOwnedGroup.mockResolvedValue(createdGroup);
      createdGroup.createTag = mockGroupCreateTag;

      await forumController.handleCreateGroup(req, res, next);

      expect(mockUserCreateOwnedGroup).toHaveBeenCalledWith({
        description: 'New Description',
        groupName: 'New Group',
        ownerId: 'user123',
        ownerType: 'User'
      });
      expect(mockGroupCreateTag).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(createdGroup);
    });

    it('should handle creation errors', async () => {
      const req = createMockReq({}, {}, {
        name: 'New Group',
        description: 'New Description',
        tags: []
      }, mockUser);
      const res = createMockRes();
      const error = new Error('Creation failed');

      mockUserCreateOwnedGroup.mockRejectedValue(error);

      await forumController.handleCreateGroup(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleGetGroupPostList', () => {
    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({ q: 'test', page: '1' }, { groupId: 'group123' });
      const res = createMockRes();

      await forumController.handleGetGroupPostList(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('User Not Found');
    });

    it('should return posts for a group with query', async () => {
      const req = createMockReq(
        { q: 'test', page: '1' }, 
        { groupId: 'group123' }, 
        {}, 
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockPostFindAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockPost]
      });
      mockPostLikesFindAll.mockResolvedValue([]);

      await forumController.handleGetGroupPostList(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(res.json).toHaveBeenCalledWith({
        groupName: 'Test Group',
        posts: [mockPost]
      });
    });

    it('should return 404 if group not found', async () => {
      const req = createMockReq(
        { q: 'test', page: '1' }, 
        { groupId: 'nonexistent' }, 
        {}, 
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(null);

      await forumController.handleGetGroupPostList(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Group not found' });
    });
  });

  describe('handleGetAllPosts', () => {
    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({ q: 'test', page: '1' });
      const res = createMockRes();

      await forumController.handleGetAllPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('User Not Found');
    });

    it('should return all posts with query', async () => {
      const req = createMockReq({ q: 'test', page: '1' }, {}, {}, mockUser);
      const res = createMockRes();

      mockPostFindAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockPost]
      });
      mockPostLikesFindAll.mockResolvedValue([]);
      mockPost.getGroupName.mockResolvedValue({
        ...mockPost,
        groupName: 'Test Group'
      });

      await forumController.handleGetAllPosts(req, res, next);

      expect(mockPostFindAndCountAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{
        createdAt: mockPost.createdAt,
        details: mockPost.details,
        groupId: mockPost.groupId,
        groupName: mockPost.groupName,
        isLiked: mockPost.isLiked,
        likes: mockPost.likes,
        postId: mockPost.postId,
        replies: mockPost.replies,
        title: mockPost.title,
        uid: mockPost.uid,
        views: mockPost.views
      }]);
    });
  });

  describe('handleCreateNewPost', () => {
    it('should create post with valid data', async () => {
      const req = createMockReq(
        {}, 
        { groupId: 'group123' }, 
        {
          title: 'New Post',
          details: 'Post content',
          tags: ['tag1']
        },
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      const newPost = { ...mockPost, postId: 'newpost123' };
      mockGroupCreatePost.mockResolvedValue(newPost);
      newPost.addNewTag = mockPostAddNewTag;

      await forumController.handleCreateNewPost(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(mockGroupCreatePost).toHaveBeenCalledWith({
        details: 'Post content',
        title: 'New Post',
        uid: 'user123'
      });
      expect(mockGroupIncrement).toHaveBeenCalledWith('postCount');
      expect(res.json).toHaveBeenCalledWith(newPost);
    });

    it('should handle group not found', async () => {
      const req = createMockReq(
        {}, 
        { groupId: 'nonexistent' }, 
        { title: 'New Post', details: 'Content', tags: [] },
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(null);

      await forumController.handleCreateNewPost(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('handleGetPostComments', () => {
    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({ page: '1' }, { postId: 'post123' });
      const res = createMockRes();

      await forumController.handleGetPostComments(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No User Found');
    });

    it('should return comments for a post', async () => {
      const req = createMockReq({ page: '1' }, { postId: 'post123' }, {}, mockUser);
      const res = createMockRes();

      mockPostFindByPk.mockResolvedValue(mockPost);
      mockPostGetReplies.mockResolvedValue([mockComment]);
      mockCommentLikesFindAll.mockResolvedValue([]);

      await forumController.handleGetPostComments(req, res, next);

      expect(mockPostFindByPk).toHaveBeenCalledWith('post123');
      expect(res.json).toHaveBeenCalledWith([{ 
        ...mockComment.toJSON(),
        Replies: [] 
      }]);
    });

    it('should return 404 if post not found', async () => {
      const req = createMockReq({ page: '1' }, { postId: 'nonexistent' }, {}, mockUser);
      const res = createMockRes();

      mockPostFindByPk.mockResolvedValue(null);

      await forumController.handleGetPostComments(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Post Not Found');
    });
  });

  describe('handleReplyToPost', () => {
    it('should create reply to post', async () => {
      const req = createMockReq(
        {}, 
        { postId: 'post123' }, 
        { content: 'Test reply' },
        mockUser
      );
      const res = createMockRes();

      mockPostFindByPk.mockResolvedValue(mockPost);
      const newComment = { ...mockComment, commentId: 'newcomment123' };
      mockPostCreateReply.mockResolvedValue(newComment);
      newComment.toJSON = vi.fn().mockReturnValue({ commentId: 'newcomment123' });

      await forumController.handleReplyToPost(req, res, next);

      expect(mockPostFindByPk).toHaveBeenCalledWith('post123');
      expect(mockPostCreateReply).toHaveBeenCalledWith({
        comment: 'Test reply',
        parentId: 'post123',
        parentType: 'ParentPost',
        uid: 'user123'
      });
      expect(mockPostIncrement).toHaveBeenCalledWith('replies');
      expect(res.json).toHaveBeenCalledWith({
        ...newComment.toJSON(),
        Replies: []
      });
    });

    it('should return 404 if post not found', async () => {
      const req = createMockReq(
        {}, 
        { postId: 'nonexistent' }, 
        { content: 'Test reply' },
        mockUser
      );
      const res = createMockRes();

      mockPostFindByPk.mockResolvedValue(null);

      await forumController.handleReplyToPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Post Not Found');
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({}, { postId: 'post123' }, { content: 'Test reply' });
      const res = createMockRes();

      mockPostFindByPk.mockResolvedValue(mockPost);

      await forumController.handleReplyToPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('User Not Found');
    });
  });

  describe('handleLikePost', () => {
    it('should like a post successfully', async () => {
      const req = createMockReq({}, { postId: 'post123' }, {}, mockUser);
      const res = createMockRes();

      mockUserLikeNewPost.mockResolvedValue(mockPost);

      await forumController.handleLikePost(req, res, next);

      expect(mockUserLikeNewPost).toHaveBeenCalledWith('post123');
      expect(mockPostIncrement).toHaveBeenCalledWith('likes');
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({}, { postId: 'post123' });
      const res = createMockRes();

      await forumController.handleLikePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No User Found');
    });

    it('should handle database errors', async () => {
      const req = createMockReq({}, { postId: 'post123' }, {}, mockUser);
      const res = createMockRes();
      const error = new Error('Database error');

      mockUserLikeNewPost.mockRejectedValue(error);

      await forumController.handleLikePost(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleUnlikePost', () => {
    it('should unlike a post successfully', async () => {
      const req = createMockReq({}, { postId: 'post123' }, {}, mockUser);
      const res = createMockRes();

      mockUserUnlikePost.mockResolvedValue(mockPost);

      await forumController.handleUnlikePost(req, res, next);

      expect(mockUserUnlikePost).toHaveBeenCalledWith('post123');
      expect(mockPostDecrement).toHaveBeenCalledWith('likes');
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('handleLikeComment', () => {
    it('should like a comment successfully', async () => {
      const req = createMockReq({}, { commentId: 'comment123' }, {}, mockUser);
      const res = createMockRes();

      mockUserLikeNewComment.mockResolvedValue(mockComment);

      await forumController.handleLikeComment(req, res, next);

      expect(mockUserLikeNewComment).toHaveBeenCalledWith('comment123');
      expect(mockCommentIncrement).toHaveBeenCalledWith('likes');
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('handleUnlikeComment', () => {
    it('should unlike a comment successfully', async () => {
      const req = createMockReq({}, { commentId: 'comment123' }, {}, mockUser);
      const res = createMockRes();

      mockUserUnlikeComment.mockResolvedValue(mockComment);

      await forumController.handleUnlikeComment(req, res, next);

      expect(mockUserUnlikeComment).toHaveBeenCalledWith('comment123');
      expect(mockCommentDecrement).toHaveBeenCalledWith('likes');
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });


  describe('handleUpdateGroup', () => {
    it('should update group if user owns it', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'Updated Group', description: 'Updated Description', tags: ['newtag'] },
        mockUser
      );
      const res = createMockRes();

      const updatedGroup = { ...mockGroup };
      mockUserGetOwnedGroups.mockResolvedValue([mockGroup]);
      mockGroup.updateGroup.mockResolvedValue(updatedGroup);

      await forumController.handleUpdateGroup(req, res, next);

      expect(mockUserGetOwnedGroups).toHaveBeenCalledWith({
        where: { groupId: 'group123' }
      });
      expect(mockGroup.updateGroup).toHaveBeenCalledWith(
        'Updated Description',
        'Updated Group',
        ['newtag']
      );
      expect(res.json).toHaveBeenCalledWith(updatedGroup);
    });

    it('should fail if user does not own group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'Updated Group', description: 'Updated Description', tags: [] },
        mockUser
      );
      const res = createMockRes();

      mockUserGetOwnedGroups.mockResolvedValue([]);

      await forumController.handleUpdateGroup(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('handleDeleteGroup', () => {
    it('should delete group if user owns it', async () => {
      const req = createMockReq({}, { groupId: 'group123' }, {}, mockUser);
      const res = createMockRes();

      mockUserGetOwnedGroups.mockResolvedValue([mockGroup]);

      await forumController.handleDeleteGroup(req, res, next);

      expect(mockForumGroupDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should fail if user does not own group', async () => {
      const req = createMockReq({}, { groupId: 'group123' }, {}, mockUser);
      const res = createMockRes();

      mockUserGetOwnedGroups.mockResolvedValue([]);

      await forumController.handleDeleteGroup(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
