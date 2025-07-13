import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../functions/useDebounce";
import {
  deletePost,
  fetchPostsByGroupId,
  fetchCommentByPostId,
  useSummaryGeneration,
} from "../functions/forumApi";

export default function GroupPostsLists() {
  const { searchQuery } = useOutletContext<{
    searchQuery: string;
  }>();
  const { groupId } = useParams();
  if (!groupId) return;

  const [pageNumber, setPageNumber] = useState(1);
  const debouncedQuery = useDebounce<string>(searchQuery, 500);
  const { postList, loading, error, hasMore, groupName, deletePostFromList } =
    fetchPostsByGroupId(groupId, debouncedQuery, pageNumber);

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    generateSummary,
  } = useSummaryGeneration();
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const generateOverallSummary = async () => {
      if (
        postList.length > 0 &&
        !summaryGenerated &&
        !loading &&
        !summaryLoading
      ) {
        try {
          let combinedContent = "";

          for (const post of postList) {
            try {
              const comments = await fetchCommentByPostId(post.postId);
              const commentsText = comments.commentList
                .map((comment) => comment.comment)
                .join(" ");

              combinedContent += `\n\nPost Title: ${post.title}\nPost Details: ${post.details}\nComments: ${commentsText}\n`;
            } catch (error) {
              console.error(
                `Failed to fetch comments for post ${post.postId}:`,
                error
              );
              combinedContent += `\n\nPost Title: ${post.title}\nPost Details: ${post.details}\nComments: No comments available\n`;
            }
          }

          console.log(
            "Generating overall summary with combined content:",
            combinedContent
          );
          await generateSummary(combinedContent);
          setSummaryGenerated(true);
        } catch (error) {
          console.error("Failed to generate overall summary:", error);
        }
      }
    };

    generateOverallSummary();
  }, [postList, summaryGenerated, loading, summaryLoading, generateSummary]);

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
      <h3 className="text-lg font-semibold mb-4">
        {groupName || "Group"} Posts
      </h3>
      {/* Overall Group Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Group Discussion Summary
        </h2>

        {summaryLoading && (
          <div className="flex items-center text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span>Analyzing all posts and discussions...</span>
          </div>
        )}

        {summaryError && (
          <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <strong>Error:</strong> {summaryError}
            </div>
          </div>
        )}

        {summary && !summaryLoading && (
          <div className="prose max-w-none">
            <div className="bg-white p-4 rounded-md border border-blue-100">
              <p className="text-gray-700 leading-relaxed text-base">
                {summary}
              </p>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Summary generated from {postList.length} posts and their
              discussions
            </div>
          </div>
        )}

        {!summary &&
          !summaryLoading &&
          !summaryError &&
          postList.length > 0 && (
            <div className="text-gray-500 italic bg-white p-4 rounded-md border border-blue-100">
              Comprehensive summary will appear here once all posts are
              analyzed...
            </div>
          )}

        {postList.length === 0 && !loading && (
          <div className="text-gray-500 italic bg-white p-4 rounded-md border border-blue-100">
            No posts found in this group to summarize.
          </div>
        )}
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
