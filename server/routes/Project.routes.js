import express from 'express'
import {
  getProjects,
  getProjectById,
  getProjectTasks,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/Projects.controller.js';

const router = express.Router()

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.get('/:id/tasks', getProjectTasks)
router.post('/', createProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router