import express from 'express';
import authRouter from './authRouter.js';
import { createToDo, getAllToDos, updateTodo, getToDoById } from '../controller/todoController.js';


const router = express.Router();

router.use('/auth', authRouter);

router.get('/getAll', getAllToDos);
router.get('/:id', getToDoById);
router.post('/createNew', createToDo)
router.put('/:id', updateTodo)

export default router;