# 📺 vidTube – Backend for a YouTube-Like Video Streaming Platform

**vidTube** is a full-featured, backend-only clone of YouTube built using **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary**. It delivers a scalable and modular RESTful API system that supports user management, video upload & streaming, likes/dislikes, comments, subscriptions, and playlists. Logging, file handling, and clean architecture practices are integrated throughout.

This project is designed with **clean code principles**, **scalable folder structure**, and **production-level middleware**, making it ideal for showcasing backend skills or serving as a foundation for a full-stack video platform.

---

## 🧠 Why This Project?

This project demonstrates proficiency in:
- Designing scalable REST APIs
- Working with large file uploads
- Implementing secure authentication
- Creating a modular Express backend
- Connecting external services (like Cloudinary)
- Logging and debugging using industry-grade tools

---

## 🚀 Tech Stack

| Tech             | Purpose                                |
|------------------|----------------------------------------|
| **Node.js**      | JavaScript runtime                     |
| **Express.js**   | Backend framework                      |
| **MongoDB**      | NoSQL database                         |
| **Mongoose**     | ODM for MongoDB                        |
| **Cloudinary**   | Media storage for videos/images        |
| **Multer**       | Handling multipart/form-data           |
| **JWT**          | User authentication                    |
| **Winston**      | Persistent logging                     |
| **Morgan**       | Request-level logging                  |
| **Postman**      | API testing and documentation          |

---

## 📦 Features Overview

### 👤 User Management
- Register, login, logout
- JWT-based authentication
- Protected routes using middleware

### 📹 Video Features
- Upload video files to Cloudinary
- Stream videos via secure links
- Fetch, update, delete videos
- Track views and upload time

### ❤️ Engagement
- Like / Dislike videos
- Comment on videos (with optional nesting)
- Subscribe/Unsubscribe from users

### 📁 Playlist System
- Create and manage custom playlists
- Add/remove videos to/from playlists

### 🔐 Security
- JWT tokens with expiration
- Route guards using middleware
- Sanitization & error handling middleware

### 📊 Logging
- HTTP logs with Morgan
- App-level logs with Winston in `logs/app.log`

---
