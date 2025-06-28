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
  const groupId = req.params.groupId;
  try {
    if (typeof params.q == "string" && typeof params.page === "string") {
      const page = parseInt(params.page);
      const group: ForumGroup | null = await ForumGroup.findByPk(groupId);
      if (!group) {
        res.status(404).json({ error: "Group not found" });
        return;
      }
      const { posts } = await searchGroupPosts(groupId, params.q, page, 10);
      res.json({
        groupName: group.groupName,
        posts: posts,
      });
    } else {
      throw new Error("No such group id. Make sure group id is a string");
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchGroupPosts = async (
  groupId: string,
  query: string,
  page = 1,
  pageSize = 10,
) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    attributes: [
      "postId",
      "title",
      "details",
      "groupId",
      "uid",
      "likes",
      "createdAt",
      "views",
      "replies",
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: {
      [Op.and]: {
        groupId: groupId,
        title: {
          [Op.iLike]: `%${query}%`,
        },
      },
    },
  });
  return {
    currentPage: page,
    posts: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

export const handleGetAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  try {
    if (typeof params.q == "string" && typeof params.page === "string") {
      const page = parseInt(params.page);
      const { posts } = await searchAllPosts(params.q, page, 10);
      const formattedPosts = await Promise.all(
        posts.map((post) => post.getGroupName()),
      );
      console.log(posts);
      console.log(formattedPosts);
      res.json(formattedPosts);
    } else {
      const { posts } = await searchAllPosts(
        "",
        parseInt(typeof params.page === "string" ? params.page : "1"),
        10,
      );
      const formattedPosts = await Promise.all(
        posts.map((post) => post.getGroupName()),
      );
      res.json(formattedPosts);
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchAllPosts = async (query: string, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const whereClause: {
    title?: {
      [Op.iLike]: string;
    };
  } = {};
  if (query.trim()) {
    whereClause.title = {
      [Op.iLike]: `%${query}%`,
    };
  }
  const { count, rows } = await Post.findAndCountAll({
    attributes: [
      "postId",
      "title",
      "details",
      "groupId",
      "uid",
      "likes",
      "createdAt",
      "views",
      "replies",
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: whereClause,
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
    res.json(group);
  } catch (error) {
    next(error);
  }
};

export const handleCreateNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const data = req.body as { details: string; title: string };
  const groupId = req.params.groupId;
  try {
    const group = await ForumGroup.findByPk(groupId);
    if (!group) throw new Error("Forum group not found");
    const post = await group.createPost({
      details: data.details,
      title: data.title,
      uid: req.user?.uid,
    });
    await group.increment("postCount");
    res.json(post);
  } catch (error) {
    next(error);
  }
  return;
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

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  const data = req.body as { details: string; title: string };
  try {
    const posts = await req.user?.getPosts({
      where: {
        postId: postId,
      },
    });
    if (!posts || posts.length === 0)
      throw new Error(
        `User ${req.user?.uid ?? ""} does not own this post ${postId}, cannot update post`,
      );
    const post = posts[0];
    const updated = await post.update({
      details: data.details,
      title: data.title,
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

export const handleDeletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  try {
    const posts = await req.user?.getPosts({
      where: {
        postId: postId,
      },
    });
    if (!posts || posts.length === 0)
      throw new Error(
        `User ${req.user?.uid ?? ""} does not own this post ${postId}, cannot update post`,
      );
    const post = posts[0];
    const group = await post.getForumGroup();
    await post.destroy();
    await group.decrement("postCount");
    res.status(200);
  } catch (error) {
    next(error);
  }
};
