/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { HasManyMixin } from "#db/types/associationtypes.js";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import Post, {PostType} from "./Post.js";

interface ForumGroup extends HasManyMixin<Post, string, "Post", "Posts"> {}

class ForumGroup extends Model<
  InferAttributes<ForumGroup>,
  InferCreationAttributes<ForumGroup>
> {
  declare groupId: CreationOptional<string>;
  declare groupName: string;

  declare Posts?: NonAttribute<Post[]>;

  // Create
  async makeNewPost(post: PostType) {
    const newPost = await Post.create({
      title: post.title,
      details: post.details,
      likes: post.likes,
      groupId: this.groupId,
    });
    this.Posts = await this.getPosts();
    return newPost;
  }

  // Read
  async getAllPosts(): Promise<Post[]> {
    this.Posts ??= await this.getPosts();
    return this.Posts;
  }

  // Update
  async editPost(post: PostType) {
    if (!post.postId) {
      throw new Error("There is no eventId to reference update");
    }
    await this.getAllPosts();
    const userPost = this.Posts?.find((p) => p.postId === post.postId);
    if (!userPost) {
      throw new Error("There is no post with such postId");
    }
    userPost.set({ ...post});
    await userPost.save();
    this.Posts = await this.getPosts();
    return userPost;
  }

  // Delete
  async deletePost(postId: string) {
    await this.getAllPosts();
    const post = this.Posts?.find((p) => p.postId === postId);
    if (post) await post.destroy();
    this.Posts = await this.getPosts();
    return this.Posts;
  }

  static associate() {
    ForumGroup.hasMany(Post, { as: "Posts", foreignKey: "groupid" });
  }

  static initModel(sequelize: Sequelize) {
    ForumGroup.init(
      {
        groupId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          type: DataTypes.UUID,
        },
        groupName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default ForumGroup;
