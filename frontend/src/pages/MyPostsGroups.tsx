import { useOutletContext } from "react-router-dom";
import type { Group, Post } from "../types";
import GroupList from "./GroupList";
import PostList from "../components/PostList";
import useDebounce from "../functions/useDebounce";
import { useEffect, useRef, useState } from "react";
import {
  deleteGroup,
  deletePost,
  fetchMyGroups,
  fetchMyPosts,
} from "../functions/forumApi";

interface MyGroupListProps {
  groups: Group[];
  handleEditGroup?: (group: Group) => void;
  searchQuery: string;
  setSelectedGroup: (group: { groupId: string; groupName: string }) => void;
}

export default function MyPostsGroups() {
  const { handleEditGroup, searchQuery, setSelectedGroup } =
    useOutletContext<MyGroupListProps>();

  const [groupPageNumber, setGroupPageNumber] = useState(1);
  const debouncedQuery = useDebounce<string>(searchQuery, 500);
  const {
    myGroupList,
    loading: groupLoading,
    error: groupError,
    hasMore: groupHasMore,
    deleteGroupFromList,
  } = fetchMyGroups(debouncedQuery, groupPageNumber);

  useEffect(() => {
    setGroupPageNumber(1);
  }, [debouncedQuery]);

  const groupObserverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observerTarget = groupObserverRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !groupLoading && groupHasMore) {
          setGroupPageNumber((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(observerTarget);
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
      observer.disconnect();
    };
  }, [groupHasMore, groupLoading]);

  const [pageNumber, setPageNumber] = useState(1);
  const {
    myPostList,
    loading: postLoading,
    error: postError,
    hasMore: postHasMore,
    deletePostFromList,
  } = fetchMyPosts(debouncedQuery, pageNumber);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

  const postObserverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observerTarget = postObserverRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !postLoading && postHasMore) {
          setPageNumber((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(observerTarget);
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
      observer.disconnect();
    };
  }, [postHasMore, postLoading]);

  const handleDeleteGroup = (groupId: string) => {
    deleteGroupFromList(groupId);
    deleteGroup(groupId).catch((err) => {
      console.error("Failed to delete group:", err);
    });
  };

  const handleDeletePost = (postId: string) => {
    deletePostFromList(postId);
    deletePost(postId).catch((error) => {
      console.error("Error deleting post:", error);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">My Posts</h3>
        <PostList
          posts={myPostList || []}
          handleDeletePost={handleDeletePost}
        />
        {postHasMore && (
          <div ref={postObserverRef} className="text-center mt-4 h-12">
            {postLoading ? (
              <p>Loading more posts...</p>
            ) : (
              <p>Scroll to load more</p>
            )}
          </div>
        )}
        <div>{postError && "...Error loading posts..."}</div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">My Groups</h3>
        <GroupList
          groups={myGroupList}
          handleDeleteMyGroup={handleDeleteGroup}
        />
        {groupHasMore && (
          <div
            ref={groupObserverRef}
            className="col-span-2 text-center mt-4 h-12"
          >
            {groupLoading ? (
              <p>Loading more groups...</p>
            ) : (
              <p>Scroll to load more</p>
            )}
          </div>
        )}
        <div>{groupError && "...Error loading groups..."}</div>
      </div>
    </div>
  );
}
