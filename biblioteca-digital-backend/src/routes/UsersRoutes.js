import { Router } from 'express';
import * as UserController from '../controllers/UserController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const UserRoutes = Router();

UserRoutes.route('/').get(UserController.get);

// Rota para registro público (não requer JWT)
UserRoutes.post('/register', UserController.create);

// Rotas administrativas (requerem JWT)
UserRoutes.post('/', verifyJWT, UserController.create);
UserRoutes.route('/:id')
  .put(verifyJWT, UserController.update)
  .delete(verifyJWT, UserController.destroy);

export default UserRoutes;
