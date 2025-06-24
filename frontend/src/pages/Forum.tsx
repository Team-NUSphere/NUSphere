import { useEffect, useState } from "react";
import ForumHeader from "../components/ForumHeader";
import CreatePostForm from "../components/CreatePostForm";
import { formatDistanceToNow } from "date-fns";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";

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
  likes: number;
  author: User;
  replies: Reply[];
  views: number;
  isLiked: boolean;
}

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

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
      views: 100
    },
  ]);

  const groups = ["CS1101", "CS2030", "CS2040", "CS3230"];

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
            groups={groups}
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
              </div>

              {activeTab === "posts" && (
                <div className="space-y-4 mt-4">
                  {/* Sort Options */}
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
                  </div>

                  {/* Posts List */}
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.postId}
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                {post.groupName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {post.author.username} •{" "}
                                {formatDistanceToNow(post.timestamp, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {post.title}
                          </h3>

                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {post.details}
                          </p>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLike(post.postId)}
                              className={`flex items-center gap-2 px-2 py-1 text-sm rounded-md hover:bg-gray-50 ${
                                post.isLiked ? "text-blue-600" : "text-gray-500"
                              }`}
                            >
                              <FaRegThumbsUp
                                className={`w-4 h-4 ${
                                  post.isLiked ? "fill-current" : ""
                                }`}
                              />
                              {post.likes}
                            </button>

                            <button className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-50">
                              <FaRegMessage className="w-4 h-4" />
                              {post.replies.length}
                            </button>

                            <button className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-50">
                              <IoEyeOutline className="w-4 h-4" />
                              {post.views}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "groups" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {groups.map((group) => (
                    <div
                      key={group}
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {group}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Computer Science Course Discussion
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            100 posts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
