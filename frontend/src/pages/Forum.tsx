import { useEffect, useState } from "react";
import ForumHeader from "../components/ForumHeader";
import CreatePostForm from "../components/CreatePostForm";
import { formatDistanceToNow } from "date-fns";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import PostPage from "./PostPage";
import PostCard from "../components/PostCard";
import GroupList from "../components/GroupList";
import PostList from "../components/PostList";

interface User {
  userId: string;
  username: string;
}

interface Reply {
  replyId: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface Post {
  postId: string;
  title: string;
  details: string;
  timestamp: Date;
  groupName: string;
  groupId: string;
  likes: number;
  author: User;
  replies: Reply[];
  views: number;
  isLiked: boolean;
}

interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  isOwner: boolean;
  posts: Post[];
}

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // TODO: const [sortBy, setSortBy] = useState("relevance");

  // This is for create post
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);

  // This is for the Post and Group tabs
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([
    {
      postId: "1",
      title: "Need help with assignment 1",
      details:
        "I'm struggling with the first part of the assignment. Can someone explain the concept of recursion?",
      author: { userId: "1", username: "StudentUser" },
      timestamp: new Date("2025-06-23T14:45:00Z"),
      groupName: "CS1101",
      likes: 5,
      replies: [
        {
          replyId: "1",
          author: { userId: "2", username: "TutorUser" },
          content:
            "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
          timestamp: new Date(),
          likes: 2,
          isLiked: false,
        },
      ],
      isLiked: false,
      views: 100,
      groupId: "1",
    },
  ]);

  const groups: Group[] = [
    {
      groupId: "1",
      groupName: "CS1101 Programming Methodology",
      description: "Discussion and help for CS1101 assignments and lectures.",
      postCount: 120,
      createdAt: new Date("2025-06-01T09:00:00Z"),
      isOwner: false,
      posts: [
        {
          postId: "1",
          title: "Need help with assignment 1",
          details:
            "I'm struggling with the first part of the assignment. Can someone explain the concept of recursion?",
          author: { userId: "1", username: "StudentUser" },
          timestamp: new Date("2025-06-23T14:45:00Z"),
          groupName: "CS1101",
          likes: 5,
          replies: [
            {
              replyId: "1",
              author: { userId: "2", username: "TutorUser" },
              content:
                "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
              timestamp: new Date(),
              likes: 2,
              isLiked: false,
            },
          ],
          isLiked: false,
          views: 100,
          groupId: "1",
        },
      ],
    },
    {
      groupId: "2",
      groupName: "CS2030 Programming Methodology II",
      description: "Object-oriented programming, Java, and more.",
      postCount: 85,
      createdAt: new Date("2025-06-10T14:30:00Z"),
      isOwner: true,
      posts: [],
    },
    {
      groupId: "3",
      groupName: "CS2040 Data Structures and Algorithms",
      description: "Share resources and discuss data structures concepts.",
      postCount: 150,
      createdAt: new Date("2025-06-15T11:20:00Z"),
      isOwner: false,
      posts: [],
    },
    {
      groupId: "4",
      groupName: "CS3230 Algorithm Design and Analysis",
      description: "Advanced algorithms, problem-solving, and exam prep.",
      postCount: 60,
      createdAt: new Date("2025-06-18T16:45:00Z"),
      isOwner: true,
      posts: [],
    },
  ];

  // Mock current user
  const currentUser: User = {
    userId: "123",
    username: "CurrentUser",
  };

  // Mock data - replace with actual data from your backend
  const [myPosts, setMyPosts] = useState<Post[]>([
    {
      postId: "1",
      title: "My question about data structures",
      details:
        "I'm having trouble understanding binary trees. Can someone help?",
      author: currentUser,
      timestamp: new Date("2025-06-25T10:30:00Z"),
      groupName: "CS2040",
      likes: 8,
      replies: [],
      views: 45,
      isLiked: false,
      groupId: "3",
    },
    {
      postId: "2",
      title: "Study group for finals",
      details:
        "Looking for people to form a study group for the upcoming finals.",
      author: currentUser,
      timestamp: new Date("2025-06-24T15:20:00Z"),
      groupName: "CS1101",
      likes: 12,
      replies: [],
      views: 89,
      isLiked: false,
      groupId: "1",
    },
  ]);

  const [myGroups, setMyGroups] = useState<Group[]>([
    {
      groupId: "4",
      groupName: "Advanced Algorithms Study Group",
      description:
        "A group for discussing advanced algorithm concepts and problem-solving techniques.",
      postCount: 15,
      createdAt: new Date("2025-06-20T09:00:00Z"),
      isOwner: true,
      posts: [
        {
          postId: "1",
          title: "Need help with assignment 1",
          details:
            "I'm struggling with the first part of the assignment. Can someone explain the concept of recursion?",
          author: { userId: "1", username: "StudentUser" },
          timestamp: new Date("2025-06-23T14:45:00Z"),
          groupName: "CS1101",
          likes: 5,
          replies: [
            {
              replyId: "1",
              author: { userId: "2", username: "TutorUser" },
              content:
                "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
              timestamp: new Date(),
              likes: 2,
              isLiked: false,
            },
          ],
          isLiked: false,
          views: 100,
          groupId: "1",
        },
      ],
    },
    {
      groupId: "5",
      groupName: "Web Development Projects",
      description:
        "Share and collaborate on web development projects and get feedback.",
      postCount: 8,
      createdAt: new Date("2025-06-18T14:30:00Z"),
      isOwner: true,
      posts: [],
    },
  ]);

  // Handler functions with TODO comments
  const handleEditPost = (postId: string) => {
    // TODO: Implement edit post functionality
    console.log("Edit post:", postId);
    setEditingPost(postId);
  };

  const handleDeletePost = (postId: string) => {
    // TODO: Implement delete post functionality
    console.log("Delete post:", postId);
    setMyPosts(myPosts.filter((post) => post.postId !== postId));
  };

  const handleEditGroup = (groupId: string) => {
    // TODO: Implement edit group functionality
    console.log("Edit group:", groupId);
    setEditingGroup(groupId);
  };

  const handleDeleteGroup = (groupId: string) => {
    // TODO: Implement delete group functionality
    console.log("Delete group:", groupId);
    setMyGroups(myGroups.filter((group) => group.groupId !== groupId));
  };

  const handleCreateClick = () => {
    setShowCreatePost(true);
  };

  const handleCreatePost = () => {
    console.log("Creating post");
  };

  const handleLike = (postId: string) => {
    console.log("Like button clicked");
    setPosts(
      posts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handlePostClick = (postId: string) => {
    // TODO: Navigate to post detail page
    console.log("Navigate to post:", postId);
    setSelectedPostId(postId);
  };

  const handleBackToForum = () => {
    setSelectedPostId(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 w-full">
      <div className="mx-auto space-y-6">
        <ForumHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={handleCreateClick}
        />

        <hr className="border-t border-gray-300" />

        {showCreatePost ? (
          <CreatePostForm
            onCancel={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postContent={postContent}
            setPostContent={setPostContent}
            groups={groups.map((group) => group.groupName)}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Navigation Tabs */}
            <div className="w-full mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg ${
                    activeTab === "posts"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("groups")}
                  className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg ${
                    activeTab === "groups"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Groups
                </button>
                <button
                  onClick={() => setActiveTab("myPostsGroups")}
                  className={`flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg ${
                    activeTab === "myPostsGroups"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Posts & Groups
                </button>
              </div>
              {activeTab === "posts" && (
                <div className="space-y-4 mt-4">
                  {
                    //TODO
                    /* Sort Options
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy("relevance")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          sortBy === "relevance"
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Relevance
                      </button>
                      <button
                        onClick={() => setSortBy("hot")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          sortBy === "hot"
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Hot
                      </button>
                      <button
                        onClick={() => setSortBy("new")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          sortBy === "new"
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        New
                      </button>
                    </div>
                  </div> */
                  }

                  {selectedPostId ? (
                    <PostPage
                      postId={selectedPostId}
                      onBack={handleBackToForum}
                      currentUser={currentUser}
                    />
                  ) : (
                    <PostList
                      posts={filteredPosts}
                      onLike={handleLike}
                      onPostClick={handlePostClick}
                    />
                  )}
                </div>
              )}
              {activeTab === "groups" &&
                (selectedGroupId ? (
                  <div>
                    <button
                      onClick={() => setSelectedGroupId(null)}
                      className="mb-4 text-blue-600 hover:underline text-sm"
                    >
                      ← Back to Groups
                    </button>
                    <h3 className="text-lg font-semibold mb-4">
                      {groups.find((g) => g.groupId === selectedGroupId)
                        ?.groupName || "Group"}{" "}
                      Posts
                    </h3>
                    <PostList
                      posts={
                        groups.find((g) => g.groupId === selectedGroupId)
                          ?.posts || []
                      }
                      onLike={handleLike}
                      onPostClick={setSelectedPostId}
                    />
                  </div>
                ) : (
                  <GroupList groups={groups} onClick={setSelectedGroupId} />
                ))}
              {activeTab === "myPostsGroups" && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* My Posts Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">My Posts</h3>
                    <div className="space-y-4">
                      {myPosts.length === 0 ? (
                        <div className="text-gray-500">
                          You have not created any posts yet.
                        </div>
                      ) : (
                        myPosts.map((post) => (
                          <div
                            key={post.postId}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                {post.groupName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(post.timestamp, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {post.title}
                            </h4>
                            <p className="text-gray-700 mb-2 line-clamp-2">
                              {post.details}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                <FaRegThumbsUp className="inline mr-1" />
                                {post.likes}
                              </span>
                              <span>
                                <FaRegMessage className="inline mr-1" />
                                {post.replies.length}
                              </span>
                              <span>
                                <IoEyeOutline className="inline mr-1" />
                                {post.views}
                              </span>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleEditPost(post.postId)}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.postId)}
                                className="text-red-600 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* My Groups Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">My Groups</h3>
                    <div className="space-y-4">
                      {myGroups.length === 0 ? (
                        <div className="text-gray-500">
                          You have not created any groups yet.
                        </div>
                      ) : (
                        myGroups.map((group) => (
                          <div
                            key={group.groupId}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">
                                {group.groupName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(group.createdAt, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2 line-clamp-2">
                              {group.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{group.postCount} posts</span>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleEditGroup(group.groupId)}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.groupId)}
                                className="text-red-600 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
