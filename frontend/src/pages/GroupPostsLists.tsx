import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../functions/useDebounce";
import {
  deletePost,
  fetchPostsByGroupId,
  getGroupTagList,
  useSummaryGeneration,
} from "../functions/forumApi";
import { FaArrowLeft } from "react-icons/fa6";

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

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    generateSummary,
  } = useSummaryGeneration();
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery, debouncedTags]);

  useEffect(() => {
    const generateOverallSummary = async () => {
      if (!summaryGenerated && !loading && !summaryLoading) {
        try {
          await generateSummary("group", groupId);
          setSummaryGenerated(true);
        } catch (error) {
          console.error("Failed to generate overall summary:", error);
        }
      }
    };

    generateOverallSummary();
  }, [summaryGenerated, loading, summaryLoading, generateSummary]);

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
    <div className="flex flex-col gap-4 px-4 py-2 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            draggable={false}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-xl font-semibold text-gray-800">
            {groupName || "Group"} Posts
          </h3>
        </div>
        <Link
          to={`/forum/group/${groupId}/resources`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Resources
        </Link>
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
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
          <div className="prose max-w-none bg-white p-4 rounded-md border border-blue-100">
            <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
            <div className="mt-3 text-sm text-gray-500">
              Summary generated from {postList.length} posts and their
              discussions.
            </div>
          </div>
        )}

        {!summary &&
          !summaryLoading &&
          !summaryError &&
          postList.length > 0 && (
            <div className="text-gray-500 italic bg-white p-4 rounded-md border border-blue-100">
              Summary will appear here once posts are analyzed...
            </div>
          )}

        {postList.length === 0 && !loading && (
          <div className="text-gray-500 italic bg-white p-4 rounded-md border border-blue-100">
            No posts found in this group to summarize.
          </div>
        )}
      </div>

      {/* Tag Filter Section */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedSet.has(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
      )}

      {/* Posts List */}
      <PostList posts={postList || []} handleDeletePost={handleDeletePost} />

      {/* Infinite Scroll */}
      {hasMore && (
        <div
          ref={observerRef}
          className="col-span-2 text-center mt-4 h-12 text-gray-500"
        >
          {loading ? <p>Loading more posts...</p> : <p>Scroll to load more</p>}
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="text-red-600 italic text-center mt-2">
          ...Error loading posts...
        </div>
      )}
    </div>
  );
}
