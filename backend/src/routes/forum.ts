import {
  handleCreateGroup,
  handleCreateNewPost,
  handleDeleteGroup,
  handleDeletePost,
  handleGetAllPosts,
  handleGetGroupList,
  handleGetGroupPostList,
  handleUpdateGroup,
  handleUpdatePost,
} from "#controllers/groupController.js";
import express from "express";

const router = express.Router();

router.get("/posts", handleGetAllPosts);

router.route("/post/:postId").put(handleUpdatePost).delete(handleDeletePost);
//get all posts in a group

router.route("/groups").get(handleGetGroupList).post(handleCreateGroup);
router
  .route("/group/:groupId")
  .get(handleGetGroupPostList)
  .post(handleCreateNewPost)
  .put(handleUpdateGroup)
  .delete(handleDeleteGroup);

export default router;
