## 1. Environment & Database Setup

- [ ] 1.1 In `myexpress/db.js`, configure SQLite connection.
- [ ] 1.2 Create DB tables for `Users`, `Items`, and `Posts`.
- [ ] 1.3 Add Multer to `myexpress/package.json` for uploading images.
- [ ] 1.4 Create `myexpress/uploads` directory and configure Express static serving.

## 2. Backend Authentication & API

- [ ] 2.1 Implement user registration and login endpoints in `myexpress/routes/users.js` with simple JWT/Session.
- [ ] 2.2 Implement item reporting endpoint in Express with Multer to handle image uploads.
- [ ] 2.3 Implement item retrieval API to fetch items by location/status.
- [ ] 2.4 Implement admin API endpoints to modify item status and delete inappropriate forum posts.
- [ ] 2.5 Implement forum API endpoints (create post, fetch posts).

## 3. Frontend Interactive Map (Vue)

- [ ] 3.1 Setup campus JPG map component in Vue with static aspect ratio.
- [ ] 3.2 Define pin locations (X%, Y%) for map rendering and make them clickable.
- [ ] 3.3 Implement UI for item list popup / drawer when a map pin is clicked.

## 4. Frontend Forms & Forum (Vue)

- [ ] 4.1 Implement item reporting form component supporting image upload via `FormData`.
- [ ] 4.2 Implement login and registration components for Students and Admins.
- [ ] 4.3 Create the Forum views (List posts, Create post, Delete if Admin).
- [ ] 4.4 Integrate authentication state globally in Vue to toggle elements based on roles.
