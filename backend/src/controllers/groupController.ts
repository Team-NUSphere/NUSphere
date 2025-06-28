import ForumGroup from "#db/models/ForumGroup.js";
import Post from "#db/models/Post.js";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

// Read
export const handleGetGroupList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  try {
    if (typeof params.q == "string" && typeof params.page == "string") {
      const { groups } = await searchGroup(params.q, parseInt(params.page), 10);
      res.json(groups);
    } else {
      const { groups } = await searchGroup(
        "",
        parseInt(typeof params.page === "string" ? params.page : "1"),
        10,
      );
      groups.forEach((group) => {
        console.log(group.toJSON());
      });
      res.json(groups);
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchGroup = async (searchValue: string, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await ForumGroup.findAndCountAll({
    attributes: ["groupId", "groupName", "description", "postCount", "ownerId"],
    limit: pageSize,
    offset: offset,
    order: [["groupName", "ASC"]],
    where: {
      groupName: { [Op.iLike]: `%${searchValue}%` },
    },
  });
  return {
    currentPage: page,
    groups: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

export const handleGetGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.params;
  const groupId = params.groupId || "No param";
  try {
    const group = await ForumGroup.findByPk(groupId);
    if (!group) throw new Error(`Cant find group of id ${groupId}`);
    res.json(group);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleGetGroupPostList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  try {
    if (typeof params.groupId == "string") {
      const page = typeof params.page == "string" ? parseInt(params.page) : 1;
      const group: ForumGroup | null = await ForumGroup.findByPk(
        params.groupId,
      );
      if (!group) {
        res.status(404).json({ error: "Group not found" });
        return;
      }
      const { posts } = await searchGroupPosts(params.groupId, page, 10);
      res.json(posts);
    } else {
      throw new Error("No such group id. Make sure group id is a string");
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchGroupPosts = async (groupId: string, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    attributes: ["postId", "title", "details", "groupId", "uid"],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: {
      groupId: groupId,
    },
  });
  return {
    currentPage: page,
    posts: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

// Create
export const handleCreateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const data = req.body as { description: string; name: string };
  try {
    const group = await req.user?.createOwnedGroup({
      description: data.description,
      groupName: data.name,
      ownerId: req.user.uid,
      ownerType: "User",
    });
    console.log(group?.toJSON());
    res.json(group);
  } catch (error) {
    next(error);
  }
};

// Update
export const handleUpdateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  const data = req.body as { description: string; name: string };
  try {
    const groups = await req.user?.getOwnedGroups({
      where: {
        groupId: groupId,
      },
    });
    if (!groups || groups.length === 0)
      throw new Error(
        `User ${req.user?.uid ?? ""} does not own this group ${groupId}, cannot update group`,
      );
    const group = groups[0];
    const updated = await group.update({
      description: data.description,
      groupName: data.name,
    });

    console.log(updated.toJSON());
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete
export const handleDeleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
    const groups = await req.user?.getOwnedGroups({
      where: {
        groupId: groupId,
      },
    });
    if (!groups || groups.length === 0)
      throw new Error(
        `User ${req.user?.uid ?? ""} does not own this group ${groupId}, cannot update group`,
      );
    const group = groups[0];
    await group.destroy();
    res.status(200);
  } catch (error) {
    next(error);
  }
};
