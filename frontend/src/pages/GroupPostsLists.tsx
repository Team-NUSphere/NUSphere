import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../functions/useDebounce";
import {
  deletePost,
  fetchPostsByGroupId,
  getGroupTagList,
} from "../functions/forumApi";

export default function GroupPostsLists() {
  const { searchQuery } = useOutletContext<{
    searchQuery: string;
  }>();
  const { groupId } = useParams();
  if (!groupId) return;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const selectedSet = new Set(selectedTags);

  const toggleTag = (tag: string) => {
    if (selectedSet.has(tag)) {
      selectedSet.delete(tag);
    } else {
      selectedSet.add(tag);
    }
    setSelectedTags(Array.from(selectedSet));
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const groupTags = await getGroupTagList(groupId);
        setAvailableTags(groupTags);
      } catch (error) {
        console.error("Failed to fetch group tags:", error);
      }
    };
    fetchTags();
  }, [groupId]);

  const [pageNumber, setPageNumber] = useState(1);
  const debouncedQuery = useDebounce<string>(searchQuery, 500);
  const debouncedTags = useDebounce<string[]>(selectedTags, 250);
  const { postList, loading, error, hasMore, groupName, deletePostFromList } =
    fetchPostsByGroupId(groupId, debouncedQuery, pageNumber, debouncedTags);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery, debouncedTags]);

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
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
  }, [hasMore, loading]);

  const handleDeletePost = (postId: string) => {
    deletePostFromList(postId);
    deletePost(postId).catch((error) => {
      console.error("Error deleting post:", error);
    });
  };

  return (
    <div>
      <Link
        to="/forum/group"
        draggable={false}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Groups
      </Link>
      <h3 className="text-lg font-semibold mb-2">
        {groupName || "Group"} Posts
      </h3>

      <div className="flex flex-wrap gap-2 mb-4 outline-none resize-none transition-colors">
        {availableTags.map((tag) => {
          const isSelected = selectedSet.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                isSelected
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <PostList posts={postList || []} handleDeletePost={handleDeletePost} />
      {hasMore && (
        <div ref={observerRef} className="col-span-2 text-center mt-4 h-12">
          {loading ? <p>Loading more posts...</p> : <p>Scroll to load more</p>}
        </div>
      )}
      <div>{error && "...Error loading posts..."}</div>
    </div>
  );
}
