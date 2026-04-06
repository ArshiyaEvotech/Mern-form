# MERN Form Builder - Evotech Assessment

### Credentials
- **Admin**: admin@evotech.global / Evotech@123
- **User**: user@evotech.global / Evotech@123

### Setup
1. **Backend**: `cd backend` -> `npm install` -> `npm start`
2. **Frontend**: `cd frontend` -> `npm install` -> `npm start`

### Backend Environment
Create `backend/.env` with:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
```

For Render or any other host, set the same values in the service environment variables. If MongoDB reports `bad auth : authentication failed`, verify the username/password in `MONGO_URI` and URL-encode special characters in the password.

### Tech Stack
- MongoDB, Express, React, Node.js, Tailwind CSS
