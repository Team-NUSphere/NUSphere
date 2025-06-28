import { useState } from "react";
import ForumHeader from "../components/ForumHeader";
import CreatePostForm from "../components/CreatePostForm";
import type { Post, Group, User, Reply } from "../types";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "../contexts/authContext";
import CreateGroupForm from "../components/CreateGroupForm";
import EditGroupForm from "../components/EditGroupForm";

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userId = getAuth().currentUser?.uid;
  const currentUser: User = {
    username: "You",
    userId: userId || "currentUserId",
  };
  const location = useLocation();

  // TODO: const [sortBy, setSortBy] = useState("relevance");

  // This is for create post
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);

  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // This is for the Post and Group tabs
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const user2: User = {
    userId: "1234",
    username: "User2",
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      postId: "3",
      title: "Need help with assignment 1",
      details:
        "I'm struggling with the first part of the assignment. Can someone explain the concept of recursion?",
      author: { userId: "1", username: "StudentUser" },
      timestamp: new Date("2025-06-23T14:45:00Z"),
      groupName: "CS1101",
      likes: 5,
      replies: {},
      // {
      //   replyId: "1",
      //   author: { userId: "2", username: "TutorUser" },
      //   content:
      //     "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
      //   timestamp: new Date(),
      //   likes: 2,
      //   isLiked: false,
      // },
      isLiked: false,
      views: 100,
      groupId: "1",
    },
  ]);

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
      replies: {},
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
      replies: {},
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
      ownerId: userId || "currentUserId",
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
          replies: {},
          // [
          //   {
          //     replyId: "1",
          //     author: { userId: "2", username: "TutorUser" },
          //     content:
          //       "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
          //     timestamp: new Date(),
          //     likes: 2,
          //     isLiked: false,
          //   },
          // ],
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
      ownerId: userId || "currentUserId",
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

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowEditGroup(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    // TODO: Implement delete group functionality
    console.log("Delete group:", groupId);
    setMyGroups(myGroups.filter((group) => group.groupId !== groupId));
  };

  const handleCreateClick = () => {
    if (showCreateGroup || showCreatePost) {
      setShowCreatePost(false);
      setShowCreateGroup(false);
      return;
    }
    const currentPath = location.pathname;
    if (currentPath.startsWith("/forum/group/")) {
      setShowCreatePost(true);
    } else {
      setShowCreateGroup(true);
    }
    return;
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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pl-4 pr-4 w-full overflow-y-auto">
      <div className="mx-auto space-y-6">
        <div className="mx-auto space-y-6 pt-4 pl-4 pr-4 sticky top-0 z-10 bg-white">
          <ForumHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateClick={handleCreateClick}
          />

          <hr className="border-t border-gray-300" />
        </div>

        {showCreatePost ? (
          <CreatePostForm
            onCancel={() => setShowCreatePost(false)}
            onSubmit={() => {}}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postContent={postContent}
            setPostContent={setPostContent}
            groups={[]}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        ) : showCreateGroup ? (
          <CreateGroupForm onCancel={() => setShowCreateGroup(false)} />
        ) : showEditGroup ? (
          <EditGroupForm
            group={editingGroup}
            onCancel={() => {
              setShowEditGroup(false);
              setEditingGroup(null);
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-3 h-full">
            {/* Navigation Tabs */}
            <div className="w-full mb-6">
              <div className="flex border-b border-gray-200">
                <NavLink
                  to="/forum/post"
                  draggable={false}
                  replace={true}
                  className={({ isActive }) =>
                    `flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg select-none ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`
                  }
                >
                  Posts
                </NavLink>
                <NavLink
                  to="/forum/group"
                  draggable={false}
                  replace={true}
                  className={({ isActive }) =>
                    `flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg select-none ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`
                  }
                >
                  Groups
                </NavLink>
                <NavLink
                  to="/forum/mine"
                  draggable={false}
                  replace={true}
                  className={({ isActive }) =>
                    `flex-1 py-2 px-4 text-center font-medium text-sm rounded-t-lg select-none ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`
                  }
                >
                  My Posts & Groups
                </NavLink>
              </div>

              <Outlet
                context={{
                  selectedPostId,
                  setSelectedPostId,
                  selectedGroupId,
                  setSelectedGroupId,
                  currentUser,
                  posts,
                  myPosts,
                  myGroups,
                  handleLike,
                  handleEditPost,
                  handleDeletePost,
                  handleEditGroup,
                  handleDeleteGroup,
                  filteredPosts,
                  setShowCreatePost,
                  postTitle,
                  setPostTitle,
                  postContent,
                  setPostContent,
                  selectedGroup,
                  setSelectedGroup,
                  searchQuery,
                  setSearchQuery,
                  showCreatePost,
                  handleCreateClick,
                  editingPost,
                  setEditingPost,
                  editingGroup,
                  setEditingGroup,
                  handlePostClick,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// {activeTab === "posts" &&
//   (selectedPostId ? (
//     renderPostView()
//   ) : (
//     //TODO
//     /* Sort Options
//     <div className="flex items-center justify-between">
//       <div className="flex gap-2">
//         <button
//           onClick={() => setSortBy("relevance")}
//           className={`px-3 py-1 text-sm rounded-md ${
//             sortBy === "relevance"
//               ? "bg-blue-600 text-white"
//               : "border border-gray-300 text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           Relevance
//         </button>
//         <button
//           onClick={() => setSortBy("hot")}
//           className={`px-3 py-1 text-sm rounded-md ${
//             sortBy === "hot"
//               ? "bg-blue-600 text-white"
//               : "border border-gray-300 text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           Hot
//         </button>
//         <button
//           onClick={() => setSortBy("new")}
//           className={`px-3 py-1 text-sm rounded-md ${
//             sortBy === "new"
//               ? "bg-blue-600 text-white"
//               : "border border-gray-300 text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           New
//         </button>
//       </div>
//     </div> */
//     <PostList
//       posts={filteredPosts}
//       currentUser={currentUser}
//       onLike={handleLike}
//       onPostClick={setSelectedPostId}
//       onEdit={handleEditPost}
//       onDelete={handleDeletePost}
//     />
//   ))}

// {activeTab === "groups" &&
//   (selectedPostId ? (
//     renderPostView()
//   ) : selectedGroupId ? (
//     renderGroupView()
//   ) : (
//     <GroupList
//       groups={groups}
//       currentUser={currentUser}
//       onClick={setSelectedGroupId}
//       onEdit={handleEditGroup}
//       onDelete={handleDeleteGroup}
//     />
//   ))}

// {activeTab === "myPostsGroups" &&
//   (selectedPostId ? (
//     renderPostView()
//   ) : selectedGroupId ? (
//     renderGroupView()
//   ) : (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <h3 className="text-lg font-semibold mb-2">My Posts</h3>
//         <PostList
//           posts={myPosts}
//           currentUser={currentUser}
//           onLike={handleLike}
//           onPostClick={setSelectedPostId}
//           onEdit={handleEditPost}
//           onDelete={handleDeletePost}
//         />
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold mb-2">My Groups</h3>
//         <GroupList
//           groups={myGroups}
//           currentUser={currentUser}
//           onClick={setSelectedGroupId}
//           onEdit={handleEditGroup}
//           onDelete={handleDeleteGroup}
//         />
//       </div>
//     </div>
//   ))}
// function renderGroupView() {
//   if (!selectedGroupId) return null;
//   const group = [...groups, ...myGroups].find(
//     (g) => g.groupId === selectedGroupId
//   );
//   return (
//     <div>
//       <button
//         onClick={() => setSelectedGroupId(null)}
//         className="mb-4 text-blue-600 hover:underline text-sm"
//       >
//         ← Back to Groups
//       </button>
//       <h3 className="text-lg font-semibold mb-4">
//         {group?.groupName || "Group"} Posts
//       </h3>
//       <PostList
//       // posts={group?.posts || []}
//       // currentUser={currentUser}
//       // onLike={handleLike}
//       // onPostClick={setSelectedPostId}
//       // onEdit={handleEditPost}
//       // onDelete={handleDeletePost}
//       />
//     </div>
//   );
// }

// function renderPostView() {
//   if (!selectedPostId) return null;
//   return (
//     <PostPage
//       postId={selectedPostId}
//       onBack={() => setSelectedPostId(null)}
//       currentUser={currentUser}
//     />
//   );
// }
