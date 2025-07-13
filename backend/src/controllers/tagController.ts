import ForumGroup from "#db/models/ForumGroup.js";
import Post from "#db/models/Post.js";
import Tags from "#db/models/Tags.js";
import { NextFunction, Request, Response } from "express";

export const handleGetGroupTagList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
    const group = await ForumGroup.findByPk(groupId, {
      include: {
        as: "Tags",
        model: Tags,
      },
    });
    if (!group || !group.Tags) {
      res.status(404).send("Group not found");
      return;
    }
    const tags = group.Tags;
    res.json(tags.map((tag) => tag.name));
  } catch (error) {
    next(error);
  }
  return;
};

export const handleGetPostTagList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId, {
      include: {
        as: "Tags",
        model: Tags,
      },
    });
    if (!post || !post.Tags) {
      res.status(404).send("Post not found");
      return;
    }
    const tags = post.Tags;
    res.json(tags.map((tag) => tag.name));
  } catch (error) {
    next(error);
  }
  return;
};
