import axios from "axios";
import type { Post, Group, Reply, User } from "../types";
import { backend } from "../constants";
import { useEffect, useState } from "react";
import axiosApi from "./axiosApi";

/** ------------------------ POSTS ------------------------ **/

export async function fetchAllPosts(): Promise<Post[]> {
  const res = await axios.get(`${backend}/posts`);
  return res.data;
}

export async function fetchPostsByGroupId(groupId: string): Promise<Post[]> {
  const res = await axios.get(`${backend}/groups/${groupId}/posts`);
  return res.data;
}

export async function fetchPostById(postId: string): Promise<Post> {
  const res = await axios.get(`${backend}/posts/${postId}`);
  return res.data;
}

export async function createPost(
  title: string,
  details: string,
  groupId: string
): Promise<Post> {
  const res = await axios.post(`${backend}/posts`, { title, details, groupId });
  return res.data;
}

export async function updatePost(
  postId: string,
  updates: Partial<Pick<Post, "title" | "details">>
): Promise<Post> {
  const res = await axios.put(`${backend}/posts/${postId}`, updates);
  return res.data;
}

export async function deletePost(postId: string): Promise<void> {
  await axios.delete(`${backend}/posts/${postId}`);
}

export async function likePost(postId: string): Promise<void> {
  await axios.post(`${backend}/posts/${postId}/like`);
}

/** ------------------------ GROUPS ------------------------ **/

export async function fetchAllGroups(
  query: string = "",
  pageNumber: number = 1
) {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

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
      url: "/modules/modList",
      params: {
        q: query,
        p: pageNumber,
      },
      signal: signal,
    })
      .then((res) => {
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
}

export async function fetchGroupById(groupId: string): Promise<Group> {
  const res = await axios.get(`${backend}/groups/${groupId}`);
  return res.data;
}

export async function createGroup(
  groupName: string,
  description: string
): Promise<Group> {
  const res = await axios.post(`${backend}/groups`, { groupName, description });
  return res.data;
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Pick<Group, "groupName" | "description">>
): Promise<Group> {
  const res = await axios.put(`${backend}/groups/${groupId}`, updates);
  return res.data;
}

export async function deleteGroup(groupId: string): Promise<void> {
  await axios.delete(`${backend}/groups/${groupId}`);
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
