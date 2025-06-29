🛠 Tech Stack

    Node.js + Express – Backend server framework

    TypeScript – Static type checking for JavaScript

    Sequelize – ORM for PostgreSQL database interaction

    Firebase Admin SDK – Authentication and admin features

    Docker – Containerization for development and deployment

📁 Project Structure

src/
├── controllers/        # Request handling logic (e.g., login, register)
├── models/             # Sequelize models (e.g., User, Timetable)
├── routes/             # Express route definitions
├── middlewares/        # Custom middlewares (e.g., error handler, logger)
├── configs/            # Configuration files (DB, CORS, etc.)
├── firebase-admin.ts   # Firebase Admin SDK initialization
└── index.ts            # App entry point

🔑 Key Features
🔐 Authentication

    Uses Firebase ID tokens for authentication.

    Registration (/register)

        Verifies the Firebase ID token.

        Creates a new user in the database if they do not already exist.

    Login (/login)

        Verifies the Firebase ID token.

        Checks if the user exists in the database; if not, auto-registers them.

🗄️ Database (PostgreSQL + Sequelize)

    Sequelize ORM connects to PostgreSQL using credentials from environment variables.

    Database Models
    🧑‍💼 User

    Represents an authenticated user (linked to Firebase UID).

        Associations:

            Has one UserTimetable

            Has many Post (forum posts)

            Has many Comment (forum comments)

            Belongs to many Module (via Enrollment)

    📅 UserTimetable

    Represents a user’s timetable (schedule).

        Associations:

            Belongs to User

            Has many UserEvent (custom events)

            Belongs to many Module (via Enrollment)

            Has many Enrollment

    📘 Module

    Represents a university module/course.

        Fields:
        moduleId, title, faculty, department, moduleCredit, lessonTypes, defaultClasses, etc.

        Associations:

            Has many Class (lesson slots)

            Belongs to many UserTimetable (via Enrollment)

            Has many Enrollment

            Belongs to many User (via Enrollment)

    🏫 Class

    Represents a specific class/lesson slot for a module.

        Fields:
        classNo, lessonType, day, startTime, endTime, venue, weeks, etc.

        Associations:

            Belongs to Module

            Belongs to many UserTimetable (via a join table)

    🔗 Enrollment

    Join table linking UserTimetable and Module.

        Fields:
        timetableId, moduleId, classes (selected class numbers)

        Associations:

            Belongs to UserTimetable

            Belongs to Module

    🗓️ UserEvent

    Custom events added by the user to their timetable.

        Fields:
        eventId, name, description, day, startTime, endTime, venue, weeks, timetableId

        Associations:

            Belongs to UserTimetable

    🧵 ForumGroup

    Represents a group/category for forum posts.

        Associations:

            Has many Post

    📝 Post

    Represents a forum post.

        Fields:
        postId, title, details, groupId, uid

        Associations:

            Belongs to ForumGroup

            Belongs to User

            Has many Comment (as replies)

    💬 Comment

    Represents a comment or reply in the forum.

        Fields:
        commentId, comment, parentId, parentType, uid

        Associations:

            Belongs to User

            Belongs to either a Post or another Comment (supports nested replies)

            Has many Comment (replies)

    

🌐 CORS

    Only allows requests from trusted origins (see trustedOrigins.ts).

    Custom middleware is defined in corsOptions.ts.

📋 Logging & Error Handling

    eventLogger.ts: Logs all incoming requests and server errors to files in the /logs directory.

    errorHandler.ts: Global error catcher; logs error and returns standardized 500 response.

🐳 Docker

    Uses a multi-stage Dockerfile to support both development and production builds.

📥 Request Flow Example

    User signs up or logs in via the frontend.

    Frontend sends an HTTP request with a Firebase ID token in the Authorization header.

    Backend verifies the token using Firebase Admin SDK.

    If the token is valid:

        The user is created or retrieved in the database.

    Backend sends back the appropriate success or error response.

🚀 Entry Point: index.ts

    Initializes and configures the Express app.

    Applies:

        CORS middleware

        JSON parsing and URL encoding

    Registers routes:

        /register

        /login

    Handles 404 (Not Found) errors.

    Sets up global error handling.

🧱 How to Extend the Backend

    Add Models: Create new Sequelize models in models/.

    Add Routes: Define routes in routes/ and their logic in controllers/.

    Add Middleware: Use middlewares for auth, logging, validation, etc.