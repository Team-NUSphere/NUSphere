export interface User {
  userId: string;
  username: string;
}

export interface Reply {
  commentId: string;
  uid: string;
  comment: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  Replies: Reply[];
  parentId: string;
  replies: number;
}

export interface Post {
  postId: string;
  title: string;
  details: string;
  createdAt: Date;
  groupName: string;
  groupId: string;
  likes: number;
  uid: string;
  views: number;
  isLiked: boolean;
  replies: number;
}

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  ownerId: string;
  posts: Post[]; //not useful for now, it would be better to segregate what we can seperate
}
