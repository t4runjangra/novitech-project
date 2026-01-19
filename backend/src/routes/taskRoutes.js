import express from "express"
import { getTask, createTask, updateTask, deleteTask } from "../controllers/taskController.js"
import { protect } from "../middleware/authMiddleware.js"
const router = express.Router()

router.route('/').get(protect, getTask).post(protect, createTask)

router.route('/:id').put(protect, updateTask).delete(protect, deleteTask)
export default router

