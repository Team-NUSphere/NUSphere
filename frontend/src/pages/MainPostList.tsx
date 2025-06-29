import { useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../functions/useDebounce";
import { deletePost, fetchAllPosts } from "../functions/forumApi";

export default function MainPostList() {
  const { searchQuery } = useOutletContext<{
    searchQuery: string;
  }>();

  const [pageNumber, setPageNumber] = useState(1);
  const debouncedQuery = useDebounce<string>(searchQuery, 500);
  const { postList, loading, error, hasMore, deletePostFromList } =
    fetchAllPosts(debouncedQuery, pageNumber);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

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
      <PostList posts={postList || []} handleDeletePost={handleDeletePost} />
      {hasMore && (
        <div ref={observerRef} className="text-center mt-4 h-12">
          {loading ? <p>Loading more posts...</p> : <p>Scroll to load more</p>}
        </div>
      )}
      <div>{error && "...Error loading posts..."}</div>
    </div>
  );
}
