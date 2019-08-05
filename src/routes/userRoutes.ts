import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRoutes = Router();

userRoutes.route('/list').get(UserController.listUsers);
userRoutes.route('/register').post(UserController.createUser);
userRoutes.route('/update').put(UserController.updateUser);
userRoutes.route('/delete').delete(UserController.deleteUser);

export default userRoutes;
