import express from 'express';
const stockRouter = express.Router();
import Stock from '../controllers/stockController.js';

// Ruta para crear un producto
stockRouter.post('/', Stock.createProduct);

// Ruta para obtener todos los productos
stockRouter.get('/', Stock.getAllProducts);

// Ruta para obtener un producto por su ID
stockRouter.get('/:id', Stock.getProductById);

// Ruta para actualizar un producto por su ID
stockRouter.put('/:id', Stock.updateProduct);

// Ruta para eliminar un producto por su ID
stockRouter.delete('/:id', Stock.deleteProduct);

export default stockRouter;
