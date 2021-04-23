import AppError from '@shared/errors/AppError';
import 'reflect-metadata';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotEmailService: SendForgotPasswordEmailService;

describe('SendoForgotPasswordEmail', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
  });

  it('should be able to retrieve password informing his email', async () => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampolel.com',
      password: '123456'
    });

    await sendForgotEmailService.execute({
      email: 'johndoes@exampolel.com'
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be not able to retrieve password os a non-existing user', async () => {
    await expect(sendForgotEmailService.execute({
      email: 'johndoes@exampole2.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampole1.com',
      password: '123456'
    });

    await sendForgotEmailService.execute({
      email: 'johndoes@exampole1.com'
    });

    expect(generateToken).toHaveBeenLastCalledWith(user.id);
  });
});
