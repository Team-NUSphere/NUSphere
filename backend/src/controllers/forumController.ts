import Comment from "#db/models/Comment.js";
import CommentLikes from "#db/models/CommentLikes.js";
import ForumGroup from "#db/models/ForumGroup.js";
import Post from "#db/models/Post.js";
import PostLikes from "#db/models/PostLikes.js";
import Tags from "#db/models/Tags.js";
import User from "#db/models/User.js";
import { NextFunction, Request, Response } from "express";
import { Op, Sequelize } from "sequelize";

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
  if (!req.user) {
    res.status(401).send("User Not Found");
    return;
  }
  const params = req.query;
  const groupId = req.params.groupId;
  try {
    if (typeof params.q == "string" && typeof params.page === "string") {
      let tags = req.query.tags as string | string[];
      if (typeof tags === "string") tags = [tags];
      const page = parseInt(params.page);
      const group: ForumGroup | null = await ForumGroup.findByPk(groupId);
      if (!group) {
        res.status(404).json({ error: "Group not found" });
        return;
      }
      const { posts } = await searchGroupPosts(
        req.user.uid,
        groupId,
        params.q,
        page,
        10,
        tags,
      );

      const formattedPosts = posts.map((post) => ({
        ...post.toJSON(),
        username: post.User?.username,
      }));
      res.json({
        groupName: group.groupName,
        posts: formattedPosts,
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
  uid: string,
  groupId: string,
  query: string,
  page = 1,
  pageSize = 10,
  tagNames?: string[],
) => {
  const offset = (page - 1) * pageSize;
  const postWhere: {
    groupId: string;
    title?: {
      [Op.iLike]: string;
    };
  } = { groupId };
  if (query) {
    postWhere.title = {
      [Op.iLike]: `%${query}%`,
    };
  }

  // if no tags are selected
  if (!tagNames || tagNames.length === 0) {
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
      include: [
        {
          as: "User",
          attributes: ["username"],
          model: User,
          required: false,
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      where: postWhere,
    });

    const postIds = rows.map((post) => post.postId);
    const likedPostIds = await PostLikes.findAll({
      attributes: ["postId"],
      where: {
        postId: postIds,
        uid,
      },
    });

    const likedSet = new Set(likedPostIds.map((like) => like.postId));
    for (const post of rows) {
      post.isLiked = likedSet.has(post.postId);
    }

    return {
      currentPage: page,
      posts: rows,
      totalCount: count,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  // tags are selected, require join table
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
    group: ["Post.postId", "User.uid", "User.username"],
    having: Sequelize.literal(
      `COUNT(DISTINCT "Tags"."tagId") = ${tagNames.length.toString()}`,
    ),
    include: [
      {
        as: "Tags",
        attributes: [],
        model: Tags,
        through: { attributes: [] },
        where: {
          name: { [Op.in]: tagNames },
        },
      },
      {
        as: "User",
        attributes: ["username"],
        model: User,
        required: false,
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    subQuery: false,
    where: postWhere,
  });

  const postIds = rows.map((post) => post.postId);
  const likedPostIds = await PostLikes.findAll({
    attributes: ["postId"],
    where: {
      postId: postIds,
      uid,
    },
  });

  const likedSet = new Set(likedPostIds.map((like) => like.postId));
  for (const post of rows) {
    post.isLiked = likedSet.has(post.postId);
  }

  return {
    currentPage: page,
    posts: rows,
    totalCount: count.length,
    totalPages: Math.ceil(count.length / pageSize),
  };
};

export const handleGetAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("User Not Found");
    return;
  }
  const params = req.query;
  try {
    if (typeof params.q == "string" && typeof params.page === "string") {
      const page = parseInt(params.page);
      const { posts } = await searchAllPosts(req.user.uid, params.q, page, 10);
      const formattedPosts = posts.map((post) => ({
        createdAt: post.createdAt,
        details: post.details,
        groupId: post.groupId,
        groupName: post.ForumGroup?.groupName,
        isLiked: post.isLiked,
        likes: post.likes,
        postId: post.postId,
        replies: post.replies,
        title: post.title,
        uid: post.uid,
        username: post.User?.username,
        views: post.views,
      }));

      res.json(formattedPosts);
    } else {
      const { posts } = await searchAllPosts(
        req.user.uid,
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

const searchAllPosts = async (
  uid: string,
  query: string,
  page = 1,
  pageSize = 10,
) => {
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
    include: [
      {
        as: "User",
        attributes: ["username"],
        model: User,
        required: false,
      },
      {
        as: "ForumGroup",
        attributes: ["groupName"],
        model: ForumGroup,
        required: false,
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: whereClause,
  });

  const postIds = rows.map((post) => post.postId);
  const likedPostIds = await PostLikes.findAll({
    attributes: ["postId"],
    where: {
      postId: postIds,
      uid,
    },
  });

  const likedSet = new Set(likedPostIds.map((like) => like.postId));
  for (const post of rows) {
    post.isLiked = likedSet.has(post.postId);
  }

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
  const data = req.body as {
    description: string;
    name: string;
    tags: string[];
  };
  try {
    const group = await req.user?.createOwnedGroup({
      description: data.description,
      groupName: data.name,
      ownerId: req.user.uid,
      ownerType: "User",
    });
    await Promise.all(
      data.tags.map((tag) =>
        group?.createTag({ groupId: group.groupId, name: tag }),
      ),
    );
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
  const data = req.body as { details: string; tags: string[]; title: string };
  const groupId = req.params.groupId;
  try {
    const group = await ForumGroup.findByPk(groupId);
    if (!group) throw new Error("Forum group not found");
    const post = await group.createPost({
      details: data.details,
      title: data.title,
      uid: req.user?.uid,
    });
    await Promise.all(data.tags.map((tag) => post.addNewTag(tag)));
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
  const data = req.body as {
    description: string;
    name: string;
    tags: string[];
  };
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
    const updated = await group.updateGroup(
      data.description,
      data.name,
      data.tags,
    );
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
  const data = req.body as { details: string; tags: string[]; title: string };
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
    const updated = await post.updatePost(data.details, data.title, data.tags);
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

// Comments
export const handleGetPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  const postId = req.params.postId;
  const params = req.query;
  try {
    if (typeof params.page == "string") {
      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).send("Post Not Found");
        return;
      }
      const comments = await searchPostComments(
        req.user.uid,
        post,
        parseInt(params.page),
        10,
      );

      res.json(
        comments.map((comment) => ({
          ...comment.toJSON(),
          Replies: [],
          username: comment.Author?.username,
        })),
      );
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchPostComments = async (
  uid: string,
  post: Post,
  page = 1,
  pageSize = 10,
) => {
  const offset = (page - 1) * pageSize;
  const comments = await post.getReplies({
    attributes: [
      "commentId",
      "comment",
      "parentId",
      "parentType",
      "uid",
      "createdAt",
      "replies",
      "likes",
    ],
    include: [
      {
        as: "Author",
        attributes: ["username"],
        model: User,
        required: false,
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });

  const commentIds = comments.map((comment) => comment.commentId);
  const likedCommentIds = await CommentLikes.findAll({
    attributes: ["commentId"],
    where: {
      commentId: commentIds,
      uid,
    },
  });

  const likedSet = new Set(likedCommentIds.map((like) => like.commentId));
  for (const comment of comments) {
    comment.isLiked = likedSet.has(comment.commentId);
  }
  return comments;
};

export const handleGetCommentComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  const commentId = req.params.commentId;
  try {
    const parentComment = await Comment.findByPk(commentId);
    if (!parentComment) {
      res.status(404).send("Comment Not Found");
      return;
    }
    const uid = req.user.uid;
    const comments = await parentComment.getReplies({
      include: [
        {
          as: "Author",
          attributes: ["username"],
          model: User,
          required: false,
        },
      ],
    });
    const commentIds = comments.map((comment) => comment.commentId);
    const likedCommentIds = await CommentLikes.findAll({
      attributes: ["commentId"],
      where: {
        commentId: commentIds,
        uid,
      },
    });

    const likedSet = new Set(likedCommentIds.map((like) => like.commentId));
    for (const comment of comments) {
      comment.isLiked = likedSet.has(comment.commentId);
    }
    res.json(
      comments.map((comment) => ({
        ...comment.toJSON(),
        Replies: [],
        username: comment.Author?.username,
      })),
    );
  } catch (error) {
    next(error);
  }
  return;
};

export const handleReplyToComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const commentId = req.params.commentId;
  const data = req.body as { content: string };
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      res.status(404).send("Comment Not Found");
      return;
    }
    if (!req.user) {
      res.status(401).send("User Not Found");
      return;
    }
    const childComment = await comment.createReply({
      comment: data.content,
      parentId: comment.commentId,
      parentType: "ParentComment",
      uid: req.user.uid,
    });
    await comment.increment("replies");
    res.json({
      ...childComment.toJSON(),
      Replies: [],
      username: req.user.username,
    });
  } catch (error) {
    next(error);
  }
};

export const handleReplyToPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const postId = req.params.postId;
  const data = req.body as { content: string };
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).send("Post Not Found");
      return;
    }
    if (!req.user) {
      res.status(401).send("User Not Found");
      return;
    }
    const comment = await post.createReply({
      comment: data.content,
      parentId: post.postId,
      parentType: "ParentPost",
      uid: req.user.uid,
    });
    await post.increment("replies");
    res.json({ ...comment.toJSON(), Replies: [], username: req.user.username });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const commentId = req.params.commentId;
  try {
    const comments = await req.user?.getComments({
      where: {
        commentId: commentId,
      },
    });
    if (!comments || comments.length === 0) {
      res.status(404).send("Comment not found");
      return;
    }
    const comment = comments[0];
    await comment.destroy();
    res.status(200);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const commentId = req.params.commentId;
  const data = req.body as { content: string };
  try {
    const comments = await req.user?.getComments({
      where: {
        commentId: commentId,
      },
    });
    if (!comments || comments.length === 0) {
      res.status(404).send("Comment not found");
      return;
    }
    const comment = comments[0];
    const updated = await comment.update({
      comment: data.content,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// My posts and groups
export const handleGetMyGroupList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  console.log("in my group");
  const params = req.query;
  try {
    if (typeof params.q == "string" && typeof params.page == "string") {
      const { groups } = await searchMyGroups(
        req.user.uid,
        params.q,
        parseInt(params.page),
        10,
      );
      const tags = await Promise.all(groups.map((group) => group.getTags()));
      const formatted = groups.map((group, idx) => ({
        ...group.toJSON(),
        tags: tags[idx].map((tag) => tag.name),
      }));
      res.json(formatted);
    } else {
      const { groups } = await searchMyGroups(
        req.user.uid,
        "",
        parseInt(typeof params.page === "string" ? params.page : "1"),
        10,
      );
      res.json(groups);
    }
  } catch (error) {
    next(error);
  }
  return;
};

const searchMyGroups = async (
  uid: string,
  searchValue: string,
  page = 1,
  pageSize = 10,
) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await ForumGroup.findAndCountAll({
    attributes: ["groupId", "groupName", "description", "postCount", "ownerId"],
    limit: pageSize,
    offset: offset,
    order: [["groupName", "ASC"]],
    where: {
      groupName: { [Op.iLike]: `%${searchValue}%` },
      ownerId: uid,
      ownerType: "User",
    },
  });
  return {
    currentPage: page,
    groups: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

export const handleGetMyPostList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  const params = req.query;
  try {
    if (typeof params.q == "string" && typeof params.page === "string") {
      const page = parseInt(params.page);
      const { posts } = await searchMyPost(req.user.uid, params.q, page, 10);
      const formattedPosts = posts.map((post) => ({
        createdAt: post.createdAt,
        details: post.details,
        groupId: post.groupId,
        groupName: post.ForumGroup?.groupName,
        isLiked: post.isLiked,
        likes: post.likes,
        postId: post.postId,
        replies: post.replies,
        title: post.title,
        uid: post.uid,
        username: req.user.username,
        views: post.views,
      }));

      res.json(formattedPosts);
    } else {
      const { posts } = await searchMyPost(
        req.user.uid,
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

const searchMyPost = async (
  uid: string,
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
    include: [
      {
        as: "ForumGroup",
        attributes: ["groupName"],
        model: ForumGroup,
        required: false,
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: {
      title: { [Op.iLike]: `%${query}%` },
      uid: uid,
    },
  });

  const postIds = rows.map((post) => post.postId);
  const likedPostIds = await PostLikes.findAll({
    attributes: ["postId"],
    where: {
      postId: postIds,
      uid,
    },
  });

  const likedSet = new Set(likedPostIds.map((like) => like.postId));
  for (const post of rows) {
    post.isLiked = likedSet.has(post.postId);
  }

  return {
    currentPage: page,
    posts: rows,
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
};

// Likes
export const handleLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  try {
    const postId: string = req.params.postId;
    const post = await req.user.likeNewPost(postId);
    await post?.increment("likes");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const handleUnlikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  try {
    const postId: string = req.params.postId;
    const post = await req.user.unlikePost(postId);
    await post?.decrement("likes");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const handleLikeComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  try {
    const commentId: string = req.params.commentId;
    const comment = await req.user.likeNewComment(commentId);
    await comment?.increment("likes");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const handleUnlikeComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).send("No User Found");
    return;
  }
  try {
    const commentId: string = req.params.commentId;
    const comment = await req.user.unlikeComment(commentId);
    await comment?.decrement("likes");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
