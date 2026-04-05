# MERN Form App Fixes: Password Auth + Vercel Deploy

## Steps:
- [x] 1. Update vercel.json to fix build (`vite: command not found`)
- [x] 2. Create backend/models/User.js (Mongoose model with bcrypt)
- [x] 3. cd backend && npm install bcryptjs
- [x] 4. Update backend/routes/authRoutes.js (register/login with DB)
- [x] 5. Update Mern-Form/src/pages/Login.jsx (specific error messages)
- [ ] 6. Restart backend, test login locally (admin@evotech.global / Evotech@123 -> admin role). Use POST /api/auth/register first if no users
- [ ] 7. Deploy & verify
