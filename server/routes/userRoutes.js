const express = require('express');
const router = express.Router();
const {
  updateProfile,
  updatePassword,
  getUsersAdmin
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.get('/', adminOnly, getUsersAdmin);

module.exports = router;
