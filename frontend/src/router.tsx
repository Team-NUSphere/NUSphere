import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
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
import Settings from "./pages/Settings";
import ClassSwap from "./pages/ClassSwap";
import EmailVerificationNotice from "./pages/EmailVerificationNotice";
import EmailVerified from "./pages/EmailVerified";
import FirebaseHandler from "./pages/FirebaseHandler";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/timetable" replace />,
  },
  {
    path: "/email-verified",
    element: <EmailVerified />,
  },
  {
    path: "/firebase-handler",
    element: <FirebaseHandler />,
  },
  {
    path: "/reset-password",
    element: <ChangePassword />,
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/email-verification",
        element: <EmailVerificationNotice />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
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
        element: <Settings />,
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
