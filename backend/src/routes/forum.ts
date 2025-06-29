import {
  handleCreateGroup,
  handleCreateNewPost,
  handleDeleteGroup,
  handleDeletePost,
  handleDeleteReply,
  handleGetAllPosts,
  handleGetCommentComments,
  handleGetGroupList,
  handleGetGroupPostList,
  handleGetMyGroupList,
  handleGetMyPostList,
  handleGetPostComments,
  handleReplyToComment,
  handleReplyToPost,
  handleUpdateGroup,
  handleUpdatePost,
  handleUpdateReply,
} from "#controllers/groupController.js";
import express from "express";

const router = express.Router();

router.get("/posts", handleGetAllPosts);
router
  .route("/post/:postId")
  .post(handleReplyToPost)
  .get(handleGetPostComments)
  .put(handleUpdatePost)
  .delete(handleDeletePost);

router.route("/groups").get(handleGetGroupList).post(handleCreateGroup);
router
  .route("/group/:groupId")
  .get(handleGetGroupPostList)
  .post(handleCreateNewPost)
  .put(handleUpdateGroup)
  .delete(handleDeleteGroup);

router
  .route("/comment/:commentId")
  .get(handleGetCommentComments)
  .post(handleReplyToComment)
  .put(handleUpdateReply)
  .delete(handleDeleteReply);

router.get("/myPosts", handleGetMyPostList);
router.get("/myGroups", handleGetMyGroupList);

export default router;
