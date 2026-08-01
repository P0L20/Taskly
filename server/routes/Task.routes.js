import express from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getGroupedTask,
} from '../controllers/Tasks.controller.js'
const router = express.Router();

router.get('/', getTasks);
router.get('/groupedTask', getGroupedTask)        
router.get('/:id', getTaskById);    
router.post('/', createTask);      
router.put('/:id', updateTask);    
router.delete('/:id', deleteTask); 

export default router