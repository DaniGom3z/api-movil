import express from 'express'
const registroRouter = express.Router();
import Registro from '../controllers/registroController.js'

registroRouter.post('/', Registro);

export default registroRouter;