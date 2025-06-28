import axios from "axios";
import type { Post, Group, Reply } from "../types";
import { backend } from "../constants";
import { useEffect, useState } from "react";
import axiosApi from "./axiosApi";

/** ------------------------ POSTS ------------------------ **/

export function fetchAllPosts(query: string = "", pageNumber: number = 1) {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setPostList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    axiosApi({
      method: "GET",
      url: "/forum/posts",
      params: {
        q: query,
        page: pageNumber,
      },
      signal: signal,
    })
      .then((res) => {
        const postList = res.data as Post[];
        setPostList((prev) => [...new Set([...prev, ...res.data])]);
        setHasMore(postList.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [pageNumber, query]);

  function deletePostFromList(postId: string) {
    setPostList((prev) => prev.filter((post) => post.postId !== postId));
  }

  return { postList, loading, error, hasMore, deletePostFromList };
}

export function fetchPostsByGroupId(
  groupId: string,
  query: string = "",
  pageNumber: number = 1
) {
  const [postList, setPostList] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    setPostList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    axiosApi({
      method: "GET",
      url: `/forum/group/${groupId}`,
      params: {
        page: pageNumber,
        q: query,
      },
      signal: signal,
    })
      .then((res) => {
        const postList = res.data.posts?.map(
          (post: {
            postId: string;
            title: string;
            details: string;
            createdAt: Date;
            groupId: string;
            likes: number;
            uid: string;
            views: number;
            isLiked: boolean;
            replies: number;
          }) => ({
            ...post,
            groupName: res.data.groupName,
          })
        );
        setPostList((prev) => [...new Set([...prev, ...postList])]);
        setHasMore(postList.length > 0);
        setLoading(false);
        setGroupName(res.data.groupName);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [pageNumber, query]);

  function deletePostFromList(postId: string) {
    setPostList((prev) => prev.filter((post) => post.postId !== postId));
  }

  return { postList, loading, error, hasMore, groupName, deletePostFromList };
}

export async function fetchPostById(postId: string): Promise<Post> {
  const res = await axiosApi({
    method: "GET",
    url: `/forum/posts/${postId}`,
  });
  return res.data;
}

export async function createPost(
  title: string,
  details: string,
  groupId: string
): Promise<number> {
  const res = await axiosApi({
    method: "POST",
    url: `/forum/group/${groupId}`,
    data: {
      title: title,
      details: details,
    },
  });
  return res.status;
}

export async function updatePost(
  postId: string,
  updates: Partial<Pick<Post, "title" | "details">>
): Promise<Post> {
  const res = await axiosApi({
    method: "PUT",
    url: `/forum/post/${postId}`,
    data: {
      title: updates.title,
      details: updates.details,
    },
  });
  return res.data;
}

export async function deletePost(postId: string): Promise<void> {
  await axiosApi({
    method: "DELETE",
    url: `/forum/post/${postId}`,
  });
}

export async function likePost(postId: string): Promise<void> {
  await axios.post(`${backend}/posts/${postId}/like`);
}

/** ------------------------ GROUPS ------------------------ **/

export function fetchAllGroups(query: string = "", pageNumber: number = 1) {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setGroupList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    axiosApi({
      method: "GET",
      url: "/forum/groups",
      params: {
        q: query,
        page: pageNumber,
      },
      signal: signal,
    })
      .then((res) => {
        if (!res) return;
        setGroupList((prev) => [...new Set([...prev, ...res.data])]);
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [query, pageNumber]);

  const deleteGroupFromList = (groupId: string) => {
    setGroupList((prev) => prev.filter((g) => g.groupId !== groupId));
  };

  return { groupList, loading, error, hasMore, deleteGroupFromList };
}

export async function createGroup(
  groupName: string,
  description: string
): Promise<Group> {
  const res = await axiosApi({
    method: "POST",
    url: "/forum/groups",
    data: {
      name: groupName,
      description: description,
    },
  });
  return res.data;
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Pick<Group, "groupName" | "description">>
): Promise<Group> {
  const res = await axiosApi({
    method: "PUT",
    url: `/forum/group/${groupId}`,
    data: {
      name: updates.groupName,
      description: updates.description,
    },
  });
  return res.data;
}

export async function deleteGroup(groupId: string): Promise<void> {
  await axiosApi({
    method: "DELETE",
    url: `/forum/group/${groupId}`,
  });
}

/** ------------------------ REPLIES ------------------------ **/

export async function addReplyToPost(
  postId: string,
  content: string
): Promise<Reply> {
  const res = await axios.post(`${backend}/posts/${postId}/replies`, {
    content,
  });
  return res.data;
}

export async function likeReply(
  postId: string,
  replyId: string
): Promise<void> {
  await axios.post(`${backend}/posts/${postId}/replies/${replyId}/like`);
}

export async function deleteReply(
  postId: string,
  replyId: string
): Promise<void> {
  await axios.delete(`${backend}/posts/${postId}/replies/${replyId}`);
}

/** ------------------------ MY POSTS / GROUPS ------------------------ **/

export async function fetchMyPosts(): Promise<Post[]> {
  const res = await axios.get(`${backend}/me/posts`);
  return res.data;
}

export async function fetchMyGroups(): Promise<Group[]> {
  const res = await axios.get(`${backend}/me/groups`);
  return res.data;
}
