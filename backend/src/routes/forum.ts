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
  handleLikeComment,
  handleLikePost,
  handleReplyToComment,
  handleReplyToPost,
  handleUnlikeComment,
  handleUnlikePost,
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

router.route("/likePost/:postId").post(handleLikePost).delete(handleUnlikePost);

router
  .route("/likeComment/:commentId")
  .post(handleLikeComment)
  .delete(handleUnlikeComment);

router.get("/myPosts", handleGetMyPostList);
router.get("/myGroups", handleGetMyGroupList);

export default router;
