# 🧠 MyBrain API Documentation

Welcome to the **MyBrain** Backend API. This documentation covers all available endpoints, their parameters, and expected behaviors.

---

## 📑 Table of Contents

- [📅 Routine Management](#-routine-management)
- [✅ Task Management](#-task-management)

---

## 📅 Routine Management

Manage the core of your daily commitment and consistency.

### `POST /routines/:date/tasks`

- **Description:** Create a routine for a specific date (if not exists) and add a task to it.
- **Params:** `date` (YYYY-MM-DD or ISO string)
- **Body:**

  ```json
  {
    "content": "Deep Work: Architecture",
    "category": "WORK",
    "plannedStart": "2026-02-13T09:00:00.000Z",
    "plannedEnd": "2026-02-13T11:00:00.000Z"
  }
  ```

- **Response:** `201 Created`

  ```json
  {
    "routine": {
      "id": "rid_2026",
      "date": "2026-02-13T00:00:00.000Z",
      "status": "INPROGRESS",
      "startedAt": "2026-02-13T09:00:00.000Z",
      "finishedAt": null,
      "cancelledAt": null,
      "tasks": [
        { 
          "id": "tid_01", 
          "content": "Deep Work: Architecture", 
          "status": "PENDING",
          "category": "WORK" 
          // ...other task fields
        }
      ]
    },
    "stats": {
      "totalTasks": 1,
      "completedTasks": 0,
      "completionRate": 0,
      "totalSecondsPlanned": 7200,
      "completedSeconds": 0
    }
  }
  ```

### `GET /routines/:date`

- **Description:** Get the routine details and statistics for a specific date.
- **Params:** `date` (YYYY-MM-DD or ISO string)
- **Response:** `200 OK`
  - Returns the same structure as `POST /routines/:date/tasks` (Routine + Stats).

### `GET /routines`

- **Description:** Get all routines for the user.
- **Response:** `200 OK`
  - Returns an array of routines.

---

## ✅ Task Management

Control task execution states.

### `POST /tasks/:id/start`

- **Description:** Start a task. Automatically pauses any other running task in the routine.
- **Params:** `id` (Task CUID)
- **Response:** `200 OK`
  - Returns updated `Routine` and `Stats`.

### `POST /tasks/:id/pause`

- **Description:** Pause a currently running task.
- **Params:** `id` (Task CUID)
- **Response:** `200 OK`
  - Returns updated `Routine` and `Stats`.

### `POST /tasks/:id/done`

- **Description:** Mark a task as completed.
- **Params:** `id` (Task CUID)
- **Response:** `200 OK`
  - Returns updated `Routine` and `Stats`.

---

## 🔐 Authentication & Errors

### Auth Header

Currently using a hardcoded `userId` for development.
Future implementation will require: `Authorization: Bearer <token>`

### Error Codes

| Status | Type | Meaning |
| :--- | :--- | :--- |
| `400` | Bad Request | Validation failed or missing parameters |
| `401` | Unauthorized | Token is missing or invalid |
| `404` | Not Found | Resource does not exist |
| `500` | Server Error | Something went wrong on our end |

---

## 🛠️ Data Infrastructure

Built with **Node.js**, **Express**, **TypeScript**, and **Prisma**.
See [schema.prisma](file:///c:/Users/Administrator/Desktop/beckend/prisma/schema.prisma) for full data modeling details.
