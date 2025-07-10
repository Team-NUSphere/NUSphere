import ForumGroup from "#db/models/ForumGroup.js";
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

export const handleCreateNewTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
  } catch (error) {
    next(error);
  }
  return;
};

export const handleChangeTagName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const groupId = req.params.groupId;
  try {
  } catch (error) {
    next(error);
  }
  return;
};

export const handleAddTagToPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  try {
  } catch (error) {
    next(error);
  }
  return;
};

export const handleDeleteTagFromPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  try {
  } catch (error) {
    next(error);
  }
  return;
};
