import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import AppError from '../errors/AppError';

import ensureAutheticated from '../middlewares/ensureAuthenticated';


const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {

  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password
    });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return response.json(userWithoutPassword);

  } catch (error) {

    return response.status(400).json({ error: error.message });

  }
});

usersRouter.patch('/avatar', ensureAutheticated, upload.single('avatar'), async (request, response) => {

  const updateUserAvatarService = new UpdateUserAvatarService();

  const user = await updateUserAvatarService.execute({
    user_id: request.user.id,
    avatarFileName: request.file.filename
  });

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return response.json(userWithoutPassword);
});

export default usersRouter;
