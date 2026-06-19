## 1. Environment & Database Setup

- [x] 1.1 In `myexpress/db.js`, configure SQLite connection.
- [x] 1.2 Create DB tables for `Users`, `Items`, and `Posts`.
- [x] 1.3 Add Multer to `myexpress/package.json` for uploading images.
- [x] 1.4 Create `myexpress/uploads` directory and configure Express static serving.

## 2. Backend Authentication & API

- [x] 2.1 Implement user registration and login endpoints in `myexpress/routes/users.js` with simple JWT/Session.
- [x] 2.2 Implement item reporting endpoint in Express with Multer to handle image uploads.
- [x] 2.3 Implement item retrieval API to fetch items by location/status.
- [x] 2.4 Implement admin API endpoints to modify item status and delete inappropriate forum posts.
- [x] 2.5 Implement forum API endpoints (create post, fetch posts).

## 3. Frontend Interactive Map (Vue)

- [x] 3.1 Setup campus JPG map component in Vue with static aspect ratio.
- [x] 3.2 Define pin locations (X%, Y%) for map rendering and make them clickable.
- [x] 3.3 Implement UI for item list popup / drawer when a map pin is clicked.

## 4. Frontend Forms & Forum (Vue)

- [x] 4.1 Implement item reporting form component supporting image upload via `FormData`.
- [x] 4.2 Implement login and registration components for Students and Admins.
- [x] 4.3 Create the Forum views (List posts, Create post, Delete if Admin).
- [x] 4.4 Integrate authentication state globally in Vue to toggle elements based on roles.
