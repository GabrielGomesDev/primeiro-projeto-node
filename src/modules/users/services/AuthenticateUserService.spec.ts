import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUserService', () => {
  it('should be able to log in if exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoes@exampole.com',
      password: '123434'
    });

    const user = await authenticateUser.execute({
      email: 'johndoes@exampole.com',
      password: '123434'
    });

    expect(user).toHaveProperty('token');
  });

  it('should be able to authenticate if exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoes@exampole.com',
      password: '123434'
    });

    const response = await authenticateUser.execute({
      email: 'johndoes@exampole.com',
      password: '123434'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to log in if user does not exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    expect(authenticateUser.execute({
      email: 'johndoes@exampole.com',
      password: '123434'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to log in if password is wrong', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoes@exampole.com',
      password: '123434'
    });

    expect(authenticateUser.execute({
      email: 'johndoes@exampole.com',
      password: '1234'
    })).rejects.toBeInstanceOf(AppError);
  });
});
