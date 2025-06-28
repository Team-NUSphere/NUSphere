import {
  handleCreateNewPost,
  handleDeletePost,
  handleGetAllPosts,
  handleUpdatePost,
} from "#controllers/forumController.js";
import {
  handleCreateGroup,
  handleDeleteGroup,
  handleGetGroupList,
  handleGetGroupPostList,
  handleUpdateGroup,
} from "#controllers/groupController.js";
import express from "express";

const router = express.Router();

router.route("/posts").get(handleGetAllPosts);

router
  .route("/:groupId/posts")
  .post(handleCreateNewPost)
  .put(handleUpdatePost)
  .delete(handleDeletePost);
//get all posts in a group

router.route("/groups").get(handleGetGroupList).post(handleCreateGroup);
router
  .route("/group/:groupId")
  .get(handleGetGroupPostList)
  .put(handleUpdateGroup)
  .delete(handleDeleteGroup);

export default router;
