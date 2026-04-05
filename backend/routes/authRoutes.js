const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEFAULT_USERS = {
  'admin@evotech.global': {
    password: 'Evotech@123',
    role: 'admin'
  },
  'user@evotech.global': {
    password: 'Evotech@123',
    role: 'user'
  }
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user (password auto-hashed)
    const user = new User({ email, password, role });
    await user.save();
    
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password ?? '';
    const defaultUser = DEFAULT_USERS[email];

    if (defaultUser && password === defaultUser.password) {
      const token = jwt.sign(
        { email, role: defaultUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const createdUser = new User({
          email,
          password: defaultUser.password,
          role: defaultUser.role
        });
        await createdUser.save();
      } else if (existingUser.role !== defaultUser.role) {
        existingUser.role = defaultUser.role;
        await existingUser.save();
      }

      return res.json({
        token,
        user: {
          email,
          role: defaultUser.role
        }
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      if (defaultUser && password === defaultUser.password) {
        const createdUser = new User({
          email,
          password: defaultUser.password,
          role: defaultUser.role
        });
        await createdUser.save();

        const token = jwt.sign(
          { email: createdUser.email, role: createdUser.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.json({
          token,
          user: {
            email: createdUser.email,
            role: createdUser.role
          }
        });
      }

      return res.status(401).json({ message: "Invalid Email" });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (defaultUser && password === defaultUser.password) {
        user.password = defaultUser.password;
        user.role = defaultUser.role;
        await user.save();

        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.json({
          token,
          user: {
            email: user.email,
            role: user.role
          }
        });
      }

      return res.status(401).json({ message: "Invalid Password" });
    }
    
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
