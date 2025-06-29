import { useState } from "react";
import ForumHeader from "../components/ForumHeader";
import CreatePostForm from "../components/CreatePostForm";
import type { Post, Group, User } from "../types";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "../contexts/authContext";
import CreateGroupForm from "../components/CreateGroupForm";
import EditGroupForm from "../components/EditGroupForm";
import EditPostForm from "../components/EditPostForm";

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userId = getAuth().currentUser?.uid;
  const currentUser: User = {
    username: "You",
    userId: userId || "currentUserId",
  };
  const location = useLocation();

  const [selectedGroup, setSelectedGroup] = useState<{
    groupId: string;
    groupName: string;
  } | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);

  // This is for the Post and Group tabs
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Handler functions with TODO comments
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowEditPost(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowEditGroup(true);
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

  // const handleLike = (postId: string) => {
  //   console.log("Like button clicked");
  //   setPosts(
  //     posts.map((post) =>
  //       post.postId === postId
  //         ? {
  //             ...post,
  //             likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  //             isLiked: !post.isLiked,
  //           }
  //         : post
  //     )
  //   );
  // };

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
            selectedGroup={selectedGroup ?? { groupId: "", groupName: "" }}
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
        ) : showEditPost ? (
          <EditPostForm
            onCancel={() => {
              setShowEditPost(false);
              setEditingPost(null);
            }}
            post={editingPost}
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
                  // handleLike,
                  handleEditPost,
                  handleEditGroup,
                  setShowCreatePost,
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
