import Comment from "#db/models/Comment.js";
import { NextFunction, Request, Response } from "express";

export const handleGetPostCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  try {
    if (typeof params.postId == "string" && typeof params.page == "string") {
      const { comments } = await searchPostComments(
        params.postId,
        parseInt(params.page),
        10,
      );
      res.json(comments);
    } else {
      throw new Error(
        "Inappropriate formatting of getting Post Comments request",
      );
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchPostComments = async (postId: string, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Comment.findAndCountAll({
    attributes: ["commentId", "comment", "uid", "parentId"],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "ASC"]],
    where: {
      parentId: postId,
      parentType: "ParentPost",
    },
  });
  return {
    comments: rows,
    currentPage: page,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

export const handleGetCommentCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const params = req.query;
  try {
    if (typeof params.commentId == "string" && typeof params.page == "string") {
      const { comments } = await searchCommentComments(
        params.commentId,
        parseInt(params.page),
        10,
      );
      res.json(comments);
    } else {
      throw new Error(
        `Inappropriate formatting of getting Comment's Comments request`,
      );
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchCommentComments = async (
  commentId: string,
  page = 1,
  pageSize = 10,
) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Comment.findAndCountAll({
    attributes: ["commentId", "comment", "uid", "parentId"],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "ASC"]],
    where: {
      parentId: commentId,
      parentType: "ParentComment",
    },
  });
  return {
    comments: rows,
    currentPage: page,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};
