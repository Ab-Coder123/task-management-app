# Task Management System

A comprehensive task management application built with React, Node.js, and MongoDB. This application allows users to manage their tasks, projects, and team collaborations efficiently.

## Features

- **User Authentication**: Secure login and registration system.
- **Task Management**: Create, read, update, and delete tasks.
- **Project Management**: Organize tasks into projects.
- **Team Collaboration**: Assign tasks to team members and track progress.
- **Dashboard**: Overview of all tasks and projects.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **Redux Toolkit**: State management.
- **React Router**: Navigation between pages.
- **Material-UI**: UI components and styling.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT (JSON Web Tokens)**: Authentication and authorization.
- **Bcrypt**: Password hashing.

## Project Structure

```
task-management-app/
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API service layer
│   │   └── App.js         # Main application component
│   └── package.json
├── server/                # Backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Express server entry point
├── .env                   # Environment variables
├── package.json           # Root project dependencies
└── README.md              # Project documentation
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (or **yarn**)
- **MongoDB** (running locally or a MongoDB Atlas connection string)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server configuration
PORT=5000

# MongoDB configuration
MONGO_URI=mongodb://localhost:27017/task_management

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

**Note**: Replace the placeholder values with your actual configuration.

## Usage

### Start the backend server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`.

### Start the frontend application

```bash
cd client
npm start
```

The application will open in your browser at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Development

### Running in development mode

For development, you can use `nodemon` to automatically restart the server on code changes:

```bash
cd server
npm run dev
```

### Running both frontend and backend

You can use a tool like `concurrently` to run both the frontend and backend simultaneously:

```bash
# Install concurrently in the root directory
npm install -g concurrently

# Run both from the root directory
concurrently "cd server && npm run dev" "cd client && npm start"
```

## Production

To build the frontend for production:

```bash
cd client
npm run build
```

To run the application in production mode, ensure your production environment variables are set and start the server:

```bash
cd server
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please open an issue or contact the maintainers.
