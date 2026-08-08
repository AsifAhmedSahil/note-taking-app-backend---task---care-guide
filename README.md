# Secure Note-Taking App — Backend

REST API for a secure note-taking application. Built with Node.js, Express, and
MongoDB as part of a technical assessment. Users create and manage their own
notes; admins manage users; posts are public.

## Features

- JWT authentication
- bcrypt password hashing
- User/Admin RBAC
- User-owned notes
- Admin user management
- Pagination
- MongoDB indexes
- MongoDB aggregation
- Public posts with `$lookup`

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- nodemon

## Setup

```bash
npm install
```

Create a `.env` file based on `.env.example`. Required variables:

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ALLOW_ADMIN_REGISTRATION` | Bootstrap admin role during registration |

## Run

```bash
npm run dev
```

```bash
npm start
```

The server connects to MongoDB before listening.

## API Endpoints

### Auth (public)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns a JWT |

### Users (authenticated, admin only)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/users` | Create a user |
| GET | `/api/users` | List users |
| GET | `/api/users/interests` | Users grouped by interest |
| GET | `/api/users/:id` | Get a user |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Notes (authenticated, user-owned)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | List the user's notes |
| GET | `/api/notes/:id` | Get one of the user's notes |
| PATCH | `/api/notes/:id` | Update one of the user's notes |
| DELETE | `/api/notes/:id` | Delete one of the user's notes |
| GET | `/api/admin/notes` | Admin: list all notes |

### Posts (public)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/posts/user/:userId` | Posts by a user, joined with the author |

All authenticated routes require `Authorization: Bearer <token>`.

## Pagination

`/api/users`, `/api/notes`, and `/api/admin/notes` support `?page=&limit=`.

- default page = 1
- default limit = 10
- maximum limit = 50
- responses include `pagination` metadata with `page`, `limit`, `total`, and
  `totalPages`

## Indexing

| Collection | Index | Used for |
| --- | --- | --- |
| users | `{ email: 1 }` unique | login lookup + uniqueness |
| users | `{ createdAt: -1 }` | user listing |
| notes | `{ owner: 1, createdAt: -1 }` | user's notes |
| notes | `{ createdAt: -1 }` | admin all-notes listing |
| posts | `{ userId: 1 }` | posts-by-user aggregation |

## Aggregations

1. `GET /api/users/interests` — `$unwind` on `interests`, then `$group` by
   interest. Done in a single `User.aggregate()` call.

2. `GET /api/posts/user/:userId` — `$match` posts for a user, `$lookup` to
   join the author, then `$project` the response shape. Done in a single
   `Post.aggregate()` call.

## Security

- passwords hashed with bcrypt
- password field excluded from normal queries
- JWT authentication
- admin RBAC
- note ownership enforced in database queries
- request field allowlists
- centralized error handling
- `.env` not committed

`ALLOW_ADMIN_REGISTRATION` only exists as a development/bootstrap mechanism to
create an admin via registration. It should remain `false` in normal use.

## Deployment

- Database: MongoDB Atlas
- Hosting: Render / Vercel / a VPS running Node
- configure the environment variables on the host
- do not commit `.env`
