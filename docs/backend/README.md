# NUSphere Backend

## 🛠 Tech Stack
- **Node.js + Express** – Backend server framework
- **TypeScript** – Static type checking for JavaScript
- **Sequelize** – ORM for PostgreSQL database interaction
- **Firebase Admin SDK** – Authentication and admin features
- **Docker** – Containerization for development and deployment

## 📁 Project Structure

```
src/
├── controllers/        # Request handling logic (e.g., login, register, forum, class swap)
├── db/
│   ├── models/         # Sequelize models (User, Timetable, Module, Forum, etc.)
│   ├── config/         # DB config
│   ├── scripts/        # Data population and migration scripts
│   └── types/          # Type definitions for DB
├── routes/             # Express route definitions
├── middlewares/        # Custom middlewares (auth, error handler, logger)
├── configs/            # Configuration files (DB, CORS, trusted origins)
├── firebase-admin.ts   # Firebase Admin SDK initialization
├── ws-handler.ts       # WebSocket (real-time collaboration)
└── index.ts            # App entry point
```

## 🔑 Key Features

### 🔐 Authentication
- Uses Firebase ID tokens for authentication.
- **Registration (`/register`)**: Verifies Firebase ID token, creates new user if not exists.
- **Login (`/login`)**: Verifies Firebase ID token, auto-registers user if not found.

### 🗄️ Database (PostgreSQL + Sequelize)
- Sequelize ORM connects to PostgreSQL using credentials from environment variables.

#### Main Models & Relationships

- **User**: Authenticated user (linked to Firebase UID).
  - Has one `UserTimetable`
  - Has many `Post` (forum posts)
  - Has many `Comment` (forum comments)
  - Belongs to many `Module` (via `Enrollment`)
  - Has many `SwapRequests` (class swap feature)
  - Has many `ForumGroup` (as owner)
  - Has many `PostLikes`, `CommentLikes` (forum likes)
  - Belongs to many `Post` and `Comment` (liked posts/comments)

- **UserTimetable**: User’s timetable (schedule).
  - Belongs to `User`
  - Has many `UserEvent` (custom events)
  - Belongs to many `Module` (via `Enrollment`)
  - Has many `Enrollment`

- **Module**: University module/course.
  - Fields: `moduleId`, `title`, `faculty`, `department`, `moduleCredit`, `lessonTypes`, `defaultClasses`, etc.
  - Has many `Class` (lesson slots)
  - Belongs to many `UserTimetable` (via `Enrollment`)
  - Has many `Enrollment`
  - Has one `ForumGroup` (module forum)

- **Class**: Specific class/lesson slot for a module.
  - Fields: `classNo`, `lessonType`, `day`, `startTime`, `endTime`, `venue`, `weeks`, etc.
  - Belongs to `Module`

- **Enrollment**: Join table linking `UserTimetable` and `Module`.
  - Fields: `timetableId`, `moduleId`, `classes` (selected class numbers)
  - Belongs to `UserTimetable`
  - Belongs to `Module`

- **UserEvent**: Custom events added by the user to their timetable.
  - Fields: `eventId`, `name`, `description`, `day`, `startTime`, `endTime`, `venue`, `weeks`, `timetableId`
  - Belongs to `UserTimetable`

- **ForumGroup**: Group/category for forum posts (can be owned by a module or user).
  - Has many `Post`
  - Has many `Tags`
  - Has many `ForumResourceCluster`
  - Belongs to `User` or `Module` (owner)

- **Post**: Forum post.
  - Fields: `postId`, `title`, `details`, `groupId`, `uid`, `likes`, `views`, etc.
  - Belongs to `ForumGroup`
  - Belongs to `User`
  - Has many `Comment` (as replies)
  - Has many `PostLikes`
  - Belongs to many `Tags` (via `PostTag`)

- **Comment**: Forum comment or reply.
  - Fields: `commentId`, `comment`, `parentId`, `parentType`, `uid`, `likes`, etc.
  - Belongs to `User`
  - Belongs to either a `Post` or another `Comment` (supports nested replies)
  - Has many `Comment` (replies)
  - Has many `CommentLikes`

- **Tags**: Tags for forum groups and posts.
  - Fields: `tagId`, `name`, `groupId`
  - Belongs to `ForumGroup`
  - Belongs to many `Post` (via `PostTag`)

- **ForumResourceCluster**: Cluster of resources for a forum group.
  - Fields: `clusterId`, `name`, `description`, `groupId`
  - Belongs to `ForumGroup`
  - Has many `ForumResource`

- **ForumResource**: Resource (e.g., file, link) in a resource cluster.
  - Fields: `resourceId`, `name`, `description`, `link`, `clusterId`
  - Belongs to `ForumResourceCluster`

- **SwapRequests**: Class swap requests for modules.
  - Fields: `id`, `status`, `moduleCode`, `lessonType`, `fromClassNo`, `toClassNos`, `uid`
  - Belongs to `User`
  - Has one `MatchedRequest`

- **MatchedRequest**: Result of a successful class swap.
  - Fields: `id`, `requestId`, `cycleId`, `position`, `fromClassNo`, `toClassNo`
  - Belongs to `SwapCycle`
  - Belongs to `SwapRequests`

- **SwapCycle**: Cycle of matched swap requests.
  - Fields: `id`, `status`
  - Has many `MatchedRequest`

- **PostLikes** / **CommentLikes**: Join tables for likes on posts/comments.
  - Belongs to `User` and `Post`/`Comment`

- **PostTag**: Join table for tags on posts.
  - Belongs to `Post` and `Tags`

## 🌐 API Routes

- `/register` – User registration
- `/login` – User login
- `/modules` – Module info and search
- `/userTimetable` – Timetable management (events, modules, classes)
- `/room` – Room management (for collaboration)
- `/forum` – Forum (groups, posts, comments, likes, tags)
- `/summary` – AI-powered summary of forum posts
- `/swap` – Class swap requests and cycles
- `/telegram` – Telegram integration
- `/user` – User profile management

## 🧩 Middleware
- **authHandler.ts**: Authenticates requests using Firebase ID tokens. Protects all routes that require authentication.
- **eventLogger.ts**: Logs all incoming requests and server errors to files in the `/logs` directory.
- **errorHandler.ts**: Global error catcher; logs error and returns standardized 500 response.
- **CORS**: Only allows requests from trusted origins (see `trustedOrigins.ts`).

## 🔄 Real-Time Collaboration (WebSocket)
- WebSocket server is initialized in `ws-handler.ts` and `index.ts`.
- Used for collaborative timetable editing and room-based real-time updates.
- Authenticates users via Firebase token in the WebSocket connection URL.
- Broadcasts changes (add, update, remove) to all users in a room.
- Handles user join/leave, and synchronizes timetable/class data in real time.

## 🤖 AI Features
- **AI Summary**: Uses Google Gemini API to generate summaries of forum posts for a module or group.

## 🐳 Docker
- Multi-stage Dockerfile for both development and production builds.

## 📥 Request Flow Example
1. User signs up or logs in via the frontend.
2. Frontend sends an HTTP request with a Firebase ID token in the Authorization header.
3. Backend verifies the token using Firebase Admin SDK.
4. If the token is valid, the user is created or retrieved in the database.
5. Backend sends back the appropriate success or error response.

## 🚀 Entry Point: `index.ts`
- Initializes and configures the Express app.
- Applies CORS, JSON parsing, and URL encoding.
- Registers all main routes and applies authentication middleware.
- Handles 404 (Not Found) errors and sets up global error handling.
- Initializes WebSocket server for real-time features.

## 🧱 How to Extend the Backend
- **Add Models**: Create new Sequelize models in `models/`.
- **Add Routes**: Define routes in `routes/` and their logic in `controllers/`.
- **Add Middleware**: Use `middlewares/` for auth, logging, validation, etc.
- **Add Real-Time Features**: Extend `ws-handler.ts` for new WebSocket events or rooms.