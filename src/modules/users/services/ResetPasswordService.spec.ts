import AppError from '@shared/errors/AppError';
import 'reflect-metadata';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
  });

  it('should be able to reset the password', async () => {

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampolel.com',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '654321',
      token
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('654321');
    expect(generateHash).toHaveBeenCalledWith('654321');
  });

  it('should be not able to reset when token does not exist', async () => {
    await expect(resetPasswordService.execute({
      password: '654321',
      token: 'non-existing-token'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to reset when user does not exist', async () => {

    const { token } = await fakeUserTokensRepository.generate('non-existing-user_id');

    await expect(resetPasswordService.execute({
      password: '654321',
      token
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to reset password if 2 hours have passed', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampolel.com',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const date = jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({
      password: '654321',
      token
    })).rejects.toBeInstanceOf(AppError);
  });

});
