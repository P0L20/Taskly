import express from 'express'

const router = express.Router()
const {
  getProjects,
  getProjectById,
  getProjectTasks,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.get('/:id/tasks', getProjectTasks)
router.post('/', createProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

module.exports = router