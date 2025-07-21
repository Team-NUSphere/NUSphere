import { createBrowserRouter, Navigate } from "react-router-dom";
//import Signup from "./pages/Signup";
//import Login from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
import Modules from "./pages/Modules";
import UserTimetable from "./pages/UserTimetable";
import Room from "./pages/Room";
import Forum from "./pages/Forum";
import GroupList from "./pages/GroupList";
import GroupPostsLists from "./pages/GroupPostsLists";
import MyPostsGroups from "./pages/MyPostsGroups";
import PostPage from "./pages/PostPage";
import MainPostList from "./pages/MainPostList";
import ForumResourcePage from "./pages/ForumResourcePage";
import ClassSwap from "./pages/ClassSwap";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/timetable",
        element: <UserTimetable />,
      },
      {
        path: "/modules/:moduleCode",
        element: <Modules />,
      },
      {
        path: "/modules",
        element: <Navigate to="/modules/ABM5003" replace />,
      },
      {
        path: "/forum",
        element: <Navigate to="/forum/post" replace />,
      },
      {
        path: "/forum",
        element: <Forum />,
        children: [
          {
            path: "/forum/post",
            element: <MainPostList />,
          },
          {
            path: "/forum/post/:postId",
            element: <PostPage />,
          },
          {
            path: "/forum/group",
            element: <GroupList />,
          },
          {
            path: "/forum/group/:groupId",
            children: [
              {
                index: true,
                element: <GroupPostsLists />,
              },
              {
                path: "/forum/group/:groupId/resources",
                element: <ForumResourcePage />,
              },
            ],
          },
          {
            path: "/forum/mine",
            element: <MyPostsGroups />,
          },
        ],
      },
      {
        path: "/settings",
        element: <div> Hello, settings page has yet to be implemented </div>,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
      {
        path: "/resources",
        element: <ForumResourcePage />,
      },
      {
        path: "/swap",
        element: <ClassSwap />,
      },
    ],
  },
]);
