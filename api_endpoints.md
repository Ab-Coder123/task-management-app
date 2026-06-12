# Task Management API Endpoints Documentation

This document records the exact backend endpoints collection for integration.

## Auth Endpoints

| Request | Method | URL | Body / Params |
|---------|--------|-----|---------------|
| Register | POST | `http://localhost:5500/api/auth/register` | JSON body (user data) |
| Login | POST | `http://localhost:5500/api/auth/login` | JSON body (credentials) |
| AllUsers | GET | `http://localhost:5500/api/auth/getusers` | - |
| GetUser | GET | `http://localhost:5500/api/auth/deleteusers_id=:_id` | path param: `_id` |
| UpdateUser | PUT | `http://localhost:5500/api/auth/updateusers_id=:_id` | path param: `_id` + JSON body |
| Delete | DELETE | `http://localhost:5500/api/auth/deleteusers_id=:_id` | path param: `_id` |

## Tasks Endpoints

| Request | Method | URL | Body / Params |
|---------|--------|-----|---------------|
| GetTasks | GET | `http://localhost:5500/api/auth/GetTask` | - |
| AddTask | POST | `http://localhost:5500/api/tasks/addtask` | JSON body (task data) |
| EditTask | PUT | `http://localhost:5500/api/tasks/updatetasks_id=:_id` | path param: `_id` + JSON body |
| Delet | DELETE | `http://localhost:5500/api/tasks/deletetasks_id=:_id` | path param: `_id` |

## Comments Endpoints

| Request | Method | URL | Body / Params |
|---------|--------|-----|---------------|
| AddComment | POST | `http://localhost:5500/api/comments/addcomment` | JSON: `taskId`, `userId`, `content` |
| GetComments | GET | `http://localhost:5500/api/comments/getcomments_id=:taskId` | path param: `taskId` |
| UpdateComment | PUT | `http://localhost:5500/api/comments/updatecomments_id=:_id` | path param: `_id` + JSON: `content`, `isReviewed` |
| DeleteComment | DELETE | `http://localhost:5500/api/comments/deletecomments_id=:_id` | path param: `_id` |

---

## Important Integration Notes:
- **Inconsistency**: `GetTasks` is located under `/api/auth/GetTask` instead of `/api/tasks`. This should be reviewed.
- **Naming Bug**: `GetUser` uses the word `deleteusers_id=` in the URL. It is better named as `getusers_id=:_id`.
- **Non-Standard Formatting**: URLs are structured using `endpoint_id=:value` (e.g. `deleteusers_id=:_id` or `getcomments_id=:taskId`). To make it standard RESTful, it should use `/endpoint/:id` formatting.
- **Note**: The backend developer is currently fixing/adjusting things in the backend. Do not write API integration code or components until they complete their adjustments.
