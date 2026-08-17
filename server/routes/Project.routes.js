import express from 'express'
import {
  getProjects,
  getProjectById,
  getProjectTasks,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectAndTasks,
} from '../controllers/Projects.controller.js';

const router = express.Router()

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.get('/:id/tasks', getProjectTasks)
router.post('/', createProject)
router.patch('/:id', updateProject)
router.delete('/:id', deleteProject)
router.delete('/:id/cascade', deleteProjectAndTasks)

export default router