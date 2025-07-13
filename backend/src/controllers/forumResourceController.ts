import ForumGroup from "#db/models/ForumGroup.js";
import ForumResource from "#db/models/ForumResource.js";
import ForumResourceCluster from "#db/models/ForumResourceCluster.js";
import { NextFunction, Request, Response } from "express";

export const handleGetGroupResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
    const group = await ForumGroup.findByPk(groupId, {
      attributes: ["groupId", "ownerId", "groupName"],
      include: [
        {
          as: "ResourceClusters",
          include: [
            {
              as: "Resources",
              model: ForumResource,
            },
          ],
          model: ForumResourceCluster,
        },
      ],
      order: [
        [
          { as: "ResourceClusters", model: ForumResourceCluster },
          "createdAt",
          "DESC",
        ],
      ],
    });

    if (!group || !group.ResourceClusters) {
      res.send("No Resources Found");
      return;
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleCreateCluster = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const groupId = req.params.groupId;
  const data = req.body as { description: string; name: string };
  try {
    const group = await ForumGroup.findByPk(groupId);

    if (!group) {
      res.status(404).send(`No group by ${groupId} found`);
      return;
    }
    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }
    const cluster = await group.createResourceCluster({
      description: data.description,
      groupId: groupId,
      name: data.name,
    });

    res.send(cluster.clusterId);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleEditCluster = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const groupId = req.params.groupId;
  const clusterId = req.params.clusterId;
  const data = req.body as { description: string; name: string };
  try {
    const group = await ForumGroup.findByPk(groupId);

    if (!group) {
      res.status(404).send(`No group by ${groupId} found`);
      return;
    }
    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }
    const cluster = await ForumResourceCluster.findOne({
      where: {
        clusterId: clusterId,
        groupId: groupId,
      },
    });
    if (!cluster) {
      res.status(404).send(`No cluster by ${clusterId} found`);
      return;
    }
    const updatedCluster = await cluster.update({
      description: data.description,
      name: data.name,
    });

    res.status(200).json(updatedCluster);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeleteCluster = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const groupId = req.params.groupId;
  const clusterId = req.params.clusterId;
  try {
    const group = await ForumGroup.findByPk(groupId);

    if (!group) {
      res.status(404).send(`No group by ${groupId} found`);
      return;
    }
    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }
    const cluster = await ForumResourceCluster.findOne({
      where: {
        clusterId: clusterId,
        groupId: groupId,
      },
    });
    if (!cluster) {
      res.status(404).send(`No cluster by ${clusterId} found`);
      return;
    }
    await cluster.destroy();

    res.status(200);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleCreateResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const clusterId = req.params.clusterId;
  const data = req.body as { description: string; link: string; title: string };
  try {
    const cluster = await ForumResourceCluster.findByPk(clusterId);

    if (!cluster) {
      res.status(404).send(`No cluster by ${clusterId} found`);
      return;
    }

    const group = await cluster.getGroup({
      attributes: ["ownerId"],
    });

    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }
    const resource = await cluster.createResource({
      clusterId: clusterId,
      description: data.description,
      link: data.link,
      name: data.title,
    });

    res.send(resource.resourceId);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleEditResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const resourceId = req.params.resourceId;
  const clusterId = req.params.clusterId;
  const data = req.body as { description: string; link: string; name: string };
  try {
    const cluster = await ForumResourceCluster.findByPk(clusterId);
    if (!cluster) {
      res.status(404).send(`No cluster by ${clusterId} found`);
      return;
    }

    const group = await cluster.getGroup({
      attributes: ["ownerId"],
    });

    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }

    const resource = await ForumResource.findOne({
      where: {
        clusterId: clusterId,
        resourceId: resourceId,
      },
    });
    if (!resource) {
      res.status(404).send(`No resource by ${resourceId} found`);
      return;
    }
    const updatedResource = await resource.update({
      description: data.description,
      link: data.link,
      name: data.name,
    });

    res.status(200).json(updatedResource);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No user found");
    return;
  }
  const resourceId = req.params.resourceId;
  const clusterId = req.params.clusterId;
  try {
    const cluster = await ForumResourceCluster.findByPk(clusterId);
    if (!cluster) {
      res.status(404).send(`No cluster by ${clusterId} found`);
      return;
    }

    const group = await cluster.getGroup({
      attributes: ["ownerId"],
    });

    if (group.ownerId !== req.user.uid) {
      res.status(405).send("Detected user is not owner of this group");
      return;
    }

    const resource = await ForumResource.findOne({
      where: {
        clusterId: clusterId,
        resourceId: resourceId,
      },
    });
    if (!resource) {
      res.status(404).send(`No resource by ${resourceId} found`);
      return;
    }
    await resource.destroy();

    res.status(200);
  } catch (error) {
    next(error);
  }
  return;
};
