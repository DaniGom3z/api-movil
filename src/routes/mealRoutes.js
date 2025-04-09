import express from 'express';
const mealRouter = express.Router();
import { createMeal, getMeals, updateMeal, deleteMeal } from '../controllers/mealController.js';

// Registrar una nueva comida
mealRouter.post('/', createMeal);

mealRouter.get('/', getMeals);

// Actualizar una comida (por ID)
mealRouter.put('/:id', updateMeal);

// Eliminar una comida (por ID)
mealRouter.delete('/:id', deleteMeal);

export default mealRouter;
