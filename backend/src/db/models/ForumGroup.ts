/* eslint-disable perfectionist/sort-classes */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BelongsToMixin, HasManyMixin } from "#db/types/associationtypes.js";
import {
  BelongsToGetAssociationMixinOptions,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import ForumResourceCluster from "./ForumResourceCluster.js";
import Module from "./Module.js";
import Post, { PostType } from "./Post.js";
import Tags from "./Tags.js";
import User from "./User.js";

interface ForumGroup extends HasManyMixin<Post, string, "Post", "Posts"> {}
interface ForumGroup extends HasManyMixin<Tags, string, "Tag", "Tags"> {}
interface ForumGroup extends BelongsToMixin<User, string, "User"> {}
interface ForumGroup extends BelongsToMixin<Module, string, "Module"> {}
interface ForumGroup
  extends HasManyMixin<
    ForumResourceCluster,
    string,
    "ResourceCluster",
    "ResourceClusters"
  > {}

class ForumGroup extends Model<
  InferAttributes<ForumGroup>,
  InferCreationAttributes<ForumGroup>
> {
  declare description: CreationOptional<string>;
  declare groupId: CreationOptional<string>;
  declare groupName: string;
  declare postCount?: CreationOptional<number>;
  declare aiCache: CreationOptional<string>;
  declare aiCacheUpdated: CreationOptional<Date>;

  declare ownerId: string;
  declare ownerType: "Module" | "User";

  declare Owner?: NonAttribute<Module | User>;
  declare UserOwner?: NonAttribute<User>;
  declare ModuleOwner?: NonAttribute<Module>;
  declare Tags?: NonAttribute<Tags[]>;
  declare ResourceClusters?: NonAttribute<ForumResourceCluster[]>;

  getOwner(options?: BelongsToGetAssociationMixinOptions) {
    const mixinMethodName = this.ownerType === "User" ? "getUser" : "getModule";
    return this[mixinMethodName](options);
  }

  declare Posts?: NonAttribute<Post[]>;

  async updateGroup(description: string, groupName: string, tags: string[]) {
    const updated = await this.update({
      description: description,
      groupName: groupName,
    });
    const oriTags = await this.getTags();
    const originalSet = new Set(oriTags.map((tag) => tag.name));
    const newSet = new Set(tags);
    const removed = oriTags.filter((tag) => !newSet.has(tag.name));
    const added = tags.filter((tag) => !originalSet.has(tag));
    await Promise.all(removed.map((tag) => tag.destroy()));
    await Promise.all(
      added.map((tag) => this.createTag({ groupId: this.groupId, name: tag })),
    );
    return updated;
  }

  static associate() {
    ForumGroup.hasMany(Post, {
      as: "Posts",
      foreignKey: "groupId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    ForumGroup.belongsTo(User, {
      as: "UserOwner",
      foreignKey: "ownerId",
      scope: { ownerType: "User" },
    });
    ForumGroup.belongsTo(Module, {
      as: "ModuleOwner",
      foreignKey: "ownerId",
      scope: { ownerType: "Module" },
    });
    ForumGroup.hasMany(Tags, {
      as: "Tags",
      foreignKey: "groupId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    ForumGroup.hasMany(ForumResourceCluster, {
      as: "ResourceClusters",
      foreignKey: "groupId",
    });
  }

  static initModel(sequelize: Sequelize) {
    ForumGroup.init(
      {
        aiCache: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        aiCacheUpdated: {
          allowNull: false,
          defaultValue: DataTypes.NOW,
          type: DataTypes.DATE,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT,
        },
        groupId: {
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          type: DataTypes.UUID,
        },
        groupName: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        ownerId: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        ownerType: {
          defaultValue: "Module",
          type: DataTypes.STRING,
        },
        postCount: {
          defaultValue: 0,
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
      },
    );

    ForumGroup.addHook("afterFind", (findResult) => {
      if (!findResult) return;
      const results: ForumGroup[] = Array.isArray(findResult)
        ? (findResult as ForumGroup[])
        : [findResult as ForumGroup];

      for (const instance of results) {
        if (
          instance.ownerType === "Module" &&
          instance.ModuleOwner !== undefined
        ) {
          instance.Owner = instance.ModuleOwner;
        } else if (
          instance.ownerType === "User" &&
          instance.UserOwner !== undefined
        ) {
          instance.Owner = instance.UserOwner;
        }
        // To prevent mistakes:
        delete instance.UserOwner;
        delete instance.ModuleOwner;
      }
    });

    ForumGroup.beforeUpdate((group) => {
      if (group.changed("aiCache")) {
        group.aiCacheUpdated = new Date();
      }
    });
  }

  // Delete
  async deletePost(postId: string) {
    await this.getAllPosts();
    const post = this.Posts?.find((p) => p.postId === postId);
    if (post) await post.destroy();
    this.Posts = await this.getPosts();
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
    userPost.set({ ...post });
    await userPost.save();
    this.Posts = await this.getPosts();
    return userPost;
  }

  // Read
  async getAllPosts(): Promise<Post[]> {
    this.Posts ??= await this.getPosts();
    return this.Posts;
  }

  // Create
  async makeNewPost(post: PostType) {
    const newPost = await Post.create({
      details: post.details,
      groupId: this.groupId,
      likes: post.likes,
      title: post.title,
    });
    this.Posts = await this.getPosts();
    return newPost;
  }
}

export default ForumGroup;
