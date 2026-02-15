# 🧠 MyBrain API Documentation

Welcome to the **MyBrain** Backend API. This documentation covers all available endpoints, their parameters, and expected behaviors.

---

## 📑 Table of Contents
- [✨ Performance & Highlights](#-performance--highlights)
- [📅 Daily Routine](#-daily-routine)
- [✅ Task Management](#-task-management)
- [👤 User Profile](#-user-profile)
- [🔐 Authentication & Errors](#-authentication--errors)

---

## ✨ Performance & Highlights
Advanced metrics and productivity highlights for a given period.

### `GET /stats/highlights`
- **Description:** Retrieve productivity scores, streaks, and total achievements.
- **Auth:** `Bearer Token` (Mocked)
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `period` | `string` | No | `day`, `week`, `month`, or `all` (default) |

- **Response:** `200 OK`
  ```json
  {
    "perfectDays": 12,
    "incompleteDays": 3,
    "dailyPercentages": [
      { "day": 13, "percentage": 100 },
      { "day": 14, "percentage": 85 }
    ],
    "totalStars": 150,
    "tulips": 45
  }
  ```

---

## 📅 Daily Routine
Manage the core of your daily commitment and consistency.

### `GET /routine/today`
- **Description:** Get today's active routine, tasks, and real-time stats.
- **Auth:** `Bearer Token`
- **Response:** `200 OK`
  ```json
  {
    "routine": {
      "id": "rid_2026",
      "date": "2026-02-13T00:00:00.000Z",
      "status": "INPROGRESS",
      "tasks": [
        { "id": "tid_01", "content": "Morning Review", "status": "DONE" }
      ]
    },
    "stats": {
      "totalTasks": 8,
      "completedTasks": 3,
      "completionRate": 38,
      "totalSecondsPlanned": 28800,
      "completedSeconds": 10800
    }
  }
  ```

### `GET /routine/calendar`
- **Description:** Monthly overview of routine completion status.
- **Query Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `month` | `number` | Yes | 1 to 12 |
  | `year` | `number` | Yes | e.g., 2026 |

- **Response:** `200 OK`
  ```json
  [
    { "date": "2026-02-13", "status": "DONE" },
    { "date": "2026-02-14", "status": "PENDING" }
  ]
  ```

---

## ✅ Task Management
Individual task lifecycle and XP progression.

### `POST /task`
- **Description:** Create a new task within today's routine block.
- **Payload:**
  ```json
  {
    "content": "Deep Work: Architecture",
    "category": "WORK",
    "plannedStart": "2026-02-13T09:00:00.000Z",
    "plannedEnd": "2026-02-13T11:00:00.000Z"
  }
  ```
- **Response:** `201 Created`

### `POST /task/:id/start` | `pause` | `done`
- **Description:** Control task execution. Starting a task automatically pauses others.
- **Params:** `id` (Task UUID)
- **Response:** `200 OK` with updated `task` and `routineStats`.

---

## 👤 User Profile
User metadata, growth levels, and XP tracking.

### `GET /user/me`
- **Description:** Current user profile including current Level and XP.
- **Response:** `200 OK`
  ```json
  {
    "id": "usr_uuid",
    "name": "Jane Doe",
    "level": 15,
    "xp": 145,
    "stars": 12,
    "tulips": 8
  }
  ```

---

## 🔐 Authentication & Errors

### Auth Header
Currently using a mocked `userId`. Pass token as:
`Authorization: Bearer <token>`

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
