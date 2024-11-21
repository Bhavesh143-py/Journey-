const express = require('express');
const router = express.Router();
const taskRoutes = require("./Tasks_routes") 
const goalRoutes = require("./goals_routes")
const userRoutes = require("./user_routes")
const journalRoutes = require('./journal_routes')
router.use('/tasks', taskRoutes);
router.use('/goals',goalRoutes);
router.use('/user',userRoutes);
router.use('/journal',journalRoutes);

module.exports = router;
