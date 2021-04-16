import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';


describe('Update User Avatar', () => {
  it('should be able to update users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    const user = fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampolel.com',
      password: '123434'
    })

    const response = await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'avatar.jpg'
    });

    expect(response).toHaveProperty('avatar');
    expect(response.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update non existing users', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    expect(updateUserAvatar.execute({
      user_id: 'non-existing-id',
      avatarFileName: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

    const user = fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoes@exampolel.com',
      password: '123434'
    });

    await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'avatar.jpg'
    });

    await updateUserAvatar.execute({
      user_id: (await user).id,
      avatarFileName: 'avatar2.jpg'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
});
