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
} from "#controllers/forumController.js";
import {
  handleCreateCluster,
  handleCreateResource,
  handleDeleteCluster,
  handleDeleteResource,
  handleEditCluster,
  handleEditResource,
  handleGetGroupResources,
} from "#controllers/forumResourceController.js";
import {
  handleGetGroupTagList,
  handleGetPostTagList,
} from "#controllers/tagController.js";
import express from "express";

const router = express.Router();

// Posts
router.get("/posts", handleGetAllPosts);
router
  .route("/post/:postId")
  .post(handleReplyToPost)
  .get(handleGetPostComments)
  .put(handleUpdatePost)
  .delete(handleDeletePost);

router.route("/likePost/:postId").post(handleLikePost).delete(handleUnlikePost);

// Groups
router.route("/groups").get(handleGetGroupList).post(handleCreateGroup);
router
  .route("/group/:groupId")
  .get(handleGetGroupPostList)
  .post(handleCreateNewPost)
  .put(handleUpdateGroup)
  .delete(handleDeleteGroup);

//Comments
router
  .route("/comment/:commentId")
  .get(handleGetCommentComments)
  .post(handleReplyToComment)
  .put(handleUpdateReply)
  .delete(handleDeleteReply);

router
  .route("/likeComment/:commentId")
  .post(handleLikeComment)
  .delete(handleUnlikeComment);

// My Posts and Groups
router.get("/myPosts", handleGetMyPostList);
router.get("/myGroups", handleGetMyGroupList);

// Tags
// Manage group tags
router.get("/tag/:groupId", handleGetGroupTagList);

// Manage post tags
router.get("/postTags/:postId", handleGetPostTagList);

// Resources
router
  .route("/resources/:groupId")
  .get(handleGetGroupResources)
  .post(handleCreateCluster);

router
  .route("/resources/:groupId/:clusterId")
  .put(handleEditCluster)
  .delete(handleDeleteCluster);

router.route("/resource/:clusterId").post(handleCreateResource);

router
  .route("/resource/:clusterId/:resourceId")
  .put(handleEditResource)
  .delete(handleDeleteResource);

export default router;
