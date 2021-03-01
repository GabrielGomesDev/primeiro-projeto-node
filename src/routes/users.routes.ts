import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import multer from 'multer';
import uploadConfig from '../config/upload';

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

  return response.json({ ok: true });
})

export default usersRouter;
