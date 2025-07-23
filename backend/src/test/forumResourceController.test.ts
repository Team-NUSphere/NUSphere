import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockForumGroupFindByPk,
  mockForumResourceClusterFindOne,
  mockForumResourceClusterFindByPk,
  mockForumResourceFindOne,
  mockGroupCreateResourceCluster,
  mockClusterUpdate,
  mockClusterDestroy,
  mockClusterCreateResource,
  mockClusterGetGroup,
  mockResourceUpdate,
  mockResourceDestroy
} = vi.hoisted(() => ({
  mockForumGroupFindByPk: vi.fn(),
  mockForumResourceClusterFindOne: vi.fn(),
  mockForumResourceClusterFindByPk: vi.fn(),
  mockForumResourceFindOne: vi.fn(),
  mockGroupCreateResourceCluster: vi.fn(),
  mockClusterUpdate: vi.fn(),
  mockClusterDestroy: vi.fn(),
  mockClusterCreateResource: vi.fn(),
  mockClusterGetGroup: vi.fn(),
  mockResourceUpdate: vi.fn(),
  mockResourceDestroy: vi.fn()
}));

vi.mock('#db/models/ForumGroup.js', () => ({
  default: {
    findByPk: mockForumGroupFindByPk
  }
}));

vi.mock('#db/models/ForumResourceCluster.js', () => ({
  default: {
    findOne: mockForumResourceClusterFindOne,
    findByPk: mockForumResourceClusterFindByPk
  }
}));

vi.mock('#db/models/ForumResource.js', () => ({
  default: {
    findOne: mockForumResourceFindOne
  }
}));

import * as forumResourceController from '../controllers/forumResourceController.js';

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
  username: 'testuser'
};

const mockGroup = {
  groupId: 'group123',
  groupName: 'Test Group',
  ownerId: 'user123',
  ResourceClusters: [
    {
      clusterId: 'cluster123',
      name: 'Test Cluster',
      Resources: []
    }
  ],
  createResourceCluster: mockGroupCreateResourceCluster
};

const mockCluster = {
  clusterId: 'cluster123',
  name: 'Test Cluster',
  description: 'Test Description',
  groupId: 'group123',
  update: mockClusterUpdate,
  destroy: mockClusterDestroy,
  createResource: mockClusterCreateResource,
  getGroup: mockClusterGetGroup
};

const mockResource = {
  resourceId: 'resource123',
  name: 'Test Resource',
  link: 'https://example.com',
  description: 'Test Description',
  clusterId: 'cluster123',
  update: mockResourceUpdate,
  destroy: mockResourceDestroy
};

describe('Forum Resource Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleGetGroupResources', () => {
    it('should return group resources when found', async () => {
      const req = createMockReq({}, { groupId: 'group123' });
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);

      await forumResourceController.handleGetGroupResources(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123', {
        attributes: ['groupId', 'ownerId', 'groupName'],
        include: [{
          as: 'ResourceClusters',
          include: [{
            as: 'Resources',
            model: expect.anything()
          }],
          model: expect.anything()
        }],
        order: [[
          { as: 'ResourceClusters', model: expect.anything() },
          'createdAt',
          'DESC'
        ]]
      });
      expect(res.json).toHaveBeenCalledWith(mockGroup);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return "No Resources Found" when group not found', async () => {
      const req = createMockReq({}, { groupId: 'nonexistent' });
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(null);

      await forumResourceController.handleGetGroupResources(req, res, next);

      expect(res.send).toHaveBeenCalledWith('No Resources Found');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return "No Resources Found" when group has no ResourceClusters', async () => {
      const req = createMockReq({}, { groupId: 'group123' });
      const res = createMockRes();

      const groupWithoutClusters = { ...mockGroup, ResourceClusters: null };
      mockForumGroupFindByPk.mockResolvedValue(groupWithoutClusters);

      await forumResourceController.handleGetGroupResources(req, res, next);

      expect(res.send).toHaveBeenCalledWith('No Resources Found');
    });

    it('should handle database errors', async () => {
      const req = createMockReq({}, { groupId: 'group123' });
      const res = createMockRes();
      const error = new Error('Database error');

      mockForumGroupFindByPk.mockRejectedValue(error);

      await forumResourceController.handleGetGroupResources(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleCreateCluster', () => {
    it('should create cluster successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'New Cluster', description: 'New Description' },
        mockUser
      );
      const res = createMockRes();

      const newCluster = { clusterId: 'newcluster123' };
      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockGroupCreateResourceCluster.mockResolvedValue(newCluster);

      await forumResourceController.handleCreateCluster(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(mockGroupCreateResourceCluster).toHaveBeenCalledWith({
        description: 'New Description',
        groupId: 'group123',
        name: 'New Cluster'
      });
      expect(res.send).toHaveBeenCalledWith('newcluster123');
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'New Cluster', description: 'New Description' }
      );
      const res = createMockRes();

      await forumResourceController.handleCreateCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No user found');
    });

    it('should return 404 if group not found', async () => {
      const req = createMockReq(
        {},
        { groupId: 'nonexistent' },
        { name: 'New Cluster', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(null);

      await forumResourceController.handleCreateCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('No group by nonexistent found');
    });

    it('should return 405 if user does not own group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'New Cluster', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      const groupOwnedByOther = { ...mockGroup, ownerId: 'otheruser' };
      mockForumGroupFindByPk.mockResolvedValue(groupOwnedByOther);

      await forumResourceController.handleCreateCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith('Detected user is not owner of this group');
    });

    it('should handle creation errors', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123' },
        { name: 'New Cluster', description: 'Description' },
        mockUser
      );
      const res = createMockRes();
      const error = new Error('Creation failed');

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockGroupCreateResourceCluster.mockRejectedValue(error);

      await forumResourceController.handleCreateCluster(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleEditCluster', () => {
    it('should update cluster successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123', clusterId: 'cluster123' },
        { name: 'Updated Cluster', description: 'Updated Description' },
        mockUser
      );
      const res = createMockRes();

      const updatedCluster = { ...mockCluster, name: 'Updated Cluster' };
      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockForumResourceClusterFindOne.mockResolvedValue(mockCluster);
      mockClusterUpdate.mockResolvedValue(updatedCluster);

      await forumResourceController.handleEditCluster(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(mockForumResourceClusterFindOne).toHaveBeenCalledWith({
        where: { clusterId: 'cluster123', groupId: 'group123' }
      });
      expect(mockClusterUpdate).toHaveBeenCalledWith({
        description: 'Updated Description',
        name: 'Updated Cluster'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCluster);
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123', clusterId: 'cluster123' },
        { name: 'Updated', description: 'Updated' }
      );
      const res = createMockRes();

      await forumResourceController.handleEditCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No user found');
    });

    it('should return 404 if cluster not found', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123', clusterId: 'nonexistent' },
        { name: 'Updated', description: 'Updated' },
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockForumResourceClusterFindOne.mockResolvedValue(null);

      await forumResourceController.handleEditCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('No cluster by nonexistent found');
    });
  });

  describe('handleDeleteCluster', () => {
    it('should delete cluster successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123', clusterId: 'cluster123' },
        {},
        mockUser
      );
      const res = createMockRes();

      mockForumGroupFindByPk.mockResolvedValue(mockGroup);
      mockForumResourceClusterFindOne.mockResolvedValue(mockCluster);

      await forumResourceController.handleDeleteCluster(req, res, next);

      expect(mockForumGroupFindByPk).toHaveBeenCalledWith('group123');
      expect(mockForumResourceClusterFindOne).toHaveBeenCalledWith({
        where: { clusterId: 'cluster123', groupId: 'group123' }
      });
      expect(mockClusterDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({}, { groupId: 'group123', clusterId: 'cluster123' });
      const res = createMockRes();

      await forumResourceController.handleDeleteCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No user found');
    });

    it('should return 405 if user does not own group', async () => {
      const req = createMockReq(
        {},
        { groupId: 'group123', clusterId: 'cluster123' },
        {},
        mockUser
      );
      const res = createMockRes();

      const groupOwnedByOther = { ...mockGroup, ownerId: 'otheruser' };
      mockForumGroupFindByPk.mockResolvedValue(groupOwnedByOther);

      await forumResourceController.handleDeleteCluster(req, res, next);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith('Detected user is not owner of this group');
    });
  });

  describe('handleCreateResource', () => {
    it('should create resource successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { clusterId: 'cluster123' },
        { title: 'New Resource', link: 'https://example.com', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      const groupWithOwnership = { ownerId: 'user123' };
      const newResource = { resourceId: 'newresource123' };
      
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupWithOwnership);
      mockClusterCreateResource.mockResolvedValue(newResource);

      await forumResourceController.handleCreateResource(req, res, next);

      expect(mockForumResourceClusterFindByPk).toHaveBeenCalledWith('cluster123');
      expect(mockClusterGetGroup).toHaveBeenCalledWith({ attributes: ['ownerId'] });
      expect(mockClusterCreateResource).toHaveBeenCalledWith({
        clusterId: 'cluster123',
        description: 'Description',
        link: 'https://example.com',
        name: 'New Resource'
      });
      expect(res.send).toHaveBeenCalledWith('newresource123');
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq(
        {},
        { clusterId: 'cluster123' },
        { title: 'Resource', link: 'https://example.com', description: 'Description' }
      );
      const res = createMockRes();

      await forumResourceController.handleCreateResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No user found');
    });

    it('should return 404 if cluster not found', async () => {
      const req = createMockReq(
        {},
        { clusterId: 'nonexistent' },
        { title: 'Resource', link: 'https://example.com', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      mockForumResourceClusterFindByPk.mockResolvedValue(null);

      await forumResourceController.handleCreateResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('No cluster by nonexistent found');
    });

    it('should return 405 if user does not own group', async () => {
      const req = createMockReq(
        {},
        { clusterId: 'cluster123' },
        { title: 'Resource', link: 'https://example.com', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      const groupOwnedByOther = { ownerId: 'otheruser' };
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupOwnedByOther);

      await forumResourceController.handleCreateResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith('Detected user is not owner of this group');
    });
  });

  describe('handleEditResource', () => {
    it('should update resource successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { resourceId: 'resource123', clusterId: 'cluster123' },
        { name: 'Updated Resource', link: 'https://updated.com', description: 'Updated Description' },
        mockUser
      );
      const res = createMockRes();

      const groupWithOwnership = { ownerId: 'user123' };
      const updatedResource = { ...mockResource, name: 'Updated Resource' };
      
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupWithOwnership);
      mockForumResourceFindOne.mockResolvedValue(mockResource);
      mockResourceUpdate.mockResolvedValue(updatedResource);

      await forumResourceController.handleEditResource(req, res, next);

      expect(mockForumResourceClusterFindByPk).toHaveBeenCalledWith('cluster123');
      expect(mockForumResourceFindOne).toHaveBeenCalledWith({
        where: { clusterId: 'cluster123', resourceId: 'resource123' }
      });
      expect(mockResourceUpdate).toHaveBeenCalledWith({
        description: 'Updated Description',
        link: 'https://updated.com',
        name: 'Updated Resource'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedResource);
    });

    it('should return 404 if resource not found', async () => {
      const req = createMockReq(
        {},
        { resourceId: 'nonexistent', clusterId: 'cluster123' },
        { name: 'Updated', link: 'https://example.com', description: 'Description' },
        mockUser
      );
      const res = createMockRes();

      const groupWithOwnership = { ownerId: 'user123' };
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupWithOwnership);
      mockForumResourceFindOne.mockResolvedValue(null);

      await forumResourceController.handleEditResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('No resource by nonexistent found');
    });
  });

  describe('handleDeleteResource', () => {
    it('should delete resource successfully when user owns group', async () => {
      const req = createMockReq(
        {},
        { resourceId: 'resource123', clusterId: 'cluster123' },
        {},
        mockUser
      );
      const res = createMockRes();

      const groupWithOwnership = { ownerId: 'user123' };
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupWithOwnership);
      mockForumResourceFindOne.mockResolvedValue(mockResource);

      await forumResourceController.handleDeleteResource(req, res, next);

      expect(mockForumResourceClusterFindByPk).toHaveBeenCalledWith('cluster123');
      expect(mockForumResourceFindOne).toHaveBeenCalledWith({
        where: { clusterId: 'cluster123', resourceId: 'resource123' }
      });
      expect(mockResourceDestroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if user not authenticated', async () => {
      const req = createMockReq({}, { resourceId: 'resource123', clusterId: 'cluster123' });
      const res = createMockRes();

      await forumResourceController.handleDeleteResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('No user found');
    });

    it('should return 404 if resource not found', async () => {
      const req = createMockReq(
        {},
        { resourceId: 'nonexistent', clusterId: 'cluster123' },
        {},
        mockUser
      );
      const res = createMockRes();

      const groupWithOwnership = { ownerId: 'user123' };
      mockForumResourceClusterFindByPk.mockResolvedValue(mockCluster);
      mockClusterGetGroup.mockResolvedValue(groupWithOwnership);
      mockForumResourceFindOne.mockResolvedValue(null);

      await forumResourceController.handleDeleteResource(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('No resource by nonexistent found');
    });

    it('should handle database errors', async () => {
      const req = createMockReq(
        {},
        { resourceId: 'resource123', clusterId: 'cluster123' },
        {},
        mockUser
      );
      const res = createMockRes();
      const error = new Error('Database error');

      mockForumResourceClusterFindByPk.mockRejectedValue(error);

      await forumResourceController.handleDeleteResource(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
