import Post from "#db/models/Post.js";
import ForumGroup from "#db/models/ForumGroup.js";
import { PostType } from "#db/models/Post.js";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

export const handleGetAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const groupId = req.params.groupId;
    const posts = await Post.findAll({
      where: { groupId },
      include: ["User", "Replies"],
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleCreateNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const groupId = req.params.groupId;
    const post: null | PostType = req.body as null | PostType;
    if (!post) throw new Error("No post found in request body");
    const forumGroup = await ForumGroup.findByPk(groupId);
    if (!forumGroup) throw new Error("Forum group not found");
    await forumGroup.makeNewPost(post);
    res.status(200);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleUpdatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.sendStatus(500);
    return;
  }
  try {
    const groupId = req.params.groupId;
    const post: null | PostType = req.body as null | PostType;
    if (!post) throw new Error("No post found in request body");
    const forumGroup = await ForumGroup.findByPk(groupId);
    if (!forumGroup) throw new Error("Forum group not found");
    await forumGroup.editPost(post);
    res.status(200);
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeletePost = async (
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
    if (params.groupId && typeof params.groupId === "string") {
      const groupId = req.params.groupId;
      const postId = req.params.postId;
      const forumGroup = await ForumGroup.findByPk(groupId);
      if (!forumGroup) throw new Error("Forum group not found");
      await forumGroup.deletePost(postId);
    } else {
        throw new Error("Inappropriate parameters provided in delete post request");
    }
    res.status(200);
  } catch (error) {
    next(error);
  }
  return;
};
