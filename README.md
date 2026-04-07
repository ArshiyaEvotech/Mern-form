# MERN Form Builder - Evotech Assessment

### Credentials
- **Admin**: admin@evotech.global / Evotech@123
- **User**: user@evotech.global / Evotech@123

### Setup
1. **Backend**: `cd backend` -> `npm install` -> `npm run dev`
2. **Frontend**: `cd Mern-Form` -> `npm install` -> `npm run dev`
3. **Run both together from root**: `npm run dev`

### Backend Environment
Create `backend/.env` with:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
```

For Render or any other host, set the same values in the service environment variables. If MongoDB reports `bad auth : authentication failed`, verify the username/password in `MONGO_URI` and URL-encode special characters in the password.

### Local URLs
- Backend health: `http://localhost:5000/health`
- Backend API: `http://localhost:5000/api`
- Frontend Vite app: usually `http://localhost:5173`

### Tech Stack
- MongoDB, Express, React, Node.js, Tailwind CSS
