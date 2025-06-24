import express from "express";
import {
  handleGetAllPosts,
  handleCreateNewPost,
  handleUpdatePost,
  handleDeletePost,
} from "#controllers/forumController.js";

const router = express.Router();

router
    .route("/posts")
    .get(handleGetAllPosts);

router
    .route("/:groupId/posts")
    .post(handleCreateNewPost)
    .put(handleUpdatePost)
    .delete(handleDeletePost);
    //get all posts in a group

export default router;
