# MyBlog — MERN Stack Blog Application

A full-featured blog application built with the MERN stack (MongoDB, Express, React, Node). This repository contains the client (frontend) and server (backend) code, example environment files, and documentation to run the project locally.

## Project overview

MyBlog provides an end-to-end example of a CRUD application with authentication and file uploads. Users can register and log in, create and manage posts with featured images, categorize posts, and search/filter content. The application demonstrates best practices for API design, secure endpoints with JWT, and a reactive frontend using React + Vite.

Key capabilities:

- User authentication (register/login) with JWT
- Create, read, update, delete posts
- Image upload for featured images (Multer)
- Categories and filtering
- Search and pagination

## Features implemented

- Authentication: register, login, logout (JWT)
- Posts: create, edit (with image replacement), delete
- Image uploads: Multer on the backend, FormData from the frontend
- Categories: list, create, assign to posts
- Search & filter: search by title/content and filter by category
- Pagination support on posts listing
- Client-side: React (Vite), Tailwind CSS for styling
- Server-side: Express, Mongoose, centralized error handling

## Repository layout

```
.
├── Backend/                # Express backend
│   ├── server/             # server source
│   │   ├── config/         # db and config
│   │   ├── models/         # Mongoose models (Post, Category, User)
│   │   ├── router/         # API routes
│   │   └── server.js       # app entry
│   └── package.json
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── client/         # client-side service wrappers
│   │   └── main.jsx
│   └── package.json
├── Week4-Assignment.md     # assignment instructions
└── README.md               # this file
```

## Setup instructions (local development)

Prerequisites

- Node.js v18+ (or latest LTS)
- MongoDB (local instance or Atlas)
- Git

1. Clone the repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-usmanoseni.git
cd mern-stack-integration-usmanoseni
```

2. Backend setup

```powershell
cd Backend
npm install
copy .env.example .env   # Windows (PowerShell)
# Edit .env to set MONGODB_URI and JWT_SECRET
npm run dev
```

3. Frontend setup

```powershell
cd frontend
npm install
copy .env.example .env   # Windows (PowerShell)
# Edit .env to set VITE_API_URI (e.g. http://localhost:5000)
npm run dev
```

Notes

- The frontend expects `VITE_API_URI` to point to the backend API base URL.
- If you use different ports, update `VITE_API_URI` and the backend `PORT` accordingly.

## Environment examples

Example backend `.env.example` (placed at `Backend/.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=replace-with-a-secure-secret
```

Example frontend `.env.example` (placed at `frontend/.env.example`):

```
VITE_API_URI=http://localhost:5000
```

## API documentation

Base URL: `{{VITE_API_URI}}` (default: `http://localhost:5000`)

Authentication

- POST /api/auth/register

  - Body: { name, email, password }
  - Response: { user, token }

- POST /api/auth/login
  - Body: { email, password }
  - Response: { user, token }

Protected endpoints require an Authorization header: `Authorization: Bearer <token>`

Posts

- GET /api/posts

  - Query params: page (number), limit (number), category (id), q (search string)
  - Response: { posts: [...], total, page, limit }

- GET /api/posts/:id

  - Response: post object

- POST /api/posts

  - Protected
  - Content-Type: multipart/form-data (when uploading featuredImage)
  - Body fields: title, content, category (id), featuredImage (file)

- PUT /api/posts/:id

  - Protected
  - Content-Type: multipart/form-data (optional file to replace image)
  - Body: same as create

- DELETE /api/posts/:id
  - Protected

Categories

- GET /api/categories

  - Response: [ { _id, name } ]

- POST /api/categories
  - Protected
  - Body: { name }

Errors

- API errors are returned with an appropriate HTTP status and JSON body: `{ message: 'error details' }`.

## Quick examples (axios)

Create a post (JS, frontend):

```js
const form = new FormData();
form.append("title", "My post");
form.append("content", "Post body");
form.append("category", categoryId);
form.append("featuredImage", fileInput.files[0]);

await api.post("/api/posts", form, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

Delete a post (JS):

```js
await api.delete(`/api/posts/${postId}`);
```

## Testing & verification

- Start both servers (backend and frontend) then use the UI or Postman to exercise endpoints.
- Ensure `JWT_SECRET` is set and `MONGODB_URI` points to a running MongoDB instance.

## Deployment notes

- For production, serve the frontend as static files or host separately (Netlify/Vercel). Point `VITE_API_URI` to your deployed API.
- Use secure environment variables (do not commit `.env`) and provide `.env.example` for reference.

## Contributing

1. Fork the repo
2. Create a branch for your feature
3. Commit and push
4. Open a PR

## License

MIT
