import { ForbiddenError, NotFoundError } from '../errors/baseErrors.js';
import UserModel from '../models/UserModel.js';

export async function get(inputFilters) {
  return UserModel.find(inputFilters).lean().exec();
}

export async function getById(_id) {
  const foundUser = await UserModel.findById(_id).lean().exec();
  if (!foundUser) throw new NotFoundError('User not found');

  return foundUser;
}

import { hashPassword } from '../utils/libs/bcrypt.js';

export async function create(inputData, currentUser = null) {
  // Verifica se já existe um usuário com este email
  const existingUser = await UserModel.findOne({ email: inputData.email }).lean().exec();
  if (existingUser) {
    throw new Error('Email já está em uso');
  }

  // Verifica se está tentando criar um admin sem ser admin
  if (inputData.isAdmin && (!currentUser || !currentUser.isAdmin)) {
    throw new ForbiddenError('Apenas administradores podem criar outros administradores');
  }

  // Gera o userName a partir do email
  const userName = inputData.email.split('@')[0];
  
  // Criptografa a senha usando bcrypt diretamente
  const hashedPassword = await hashPassword(inputData.password);
  
  console.log('Criando usuário:', {
    email: inputData.email,
    hashedPassword: !!hashedPassword,
    passwordLength: hashedPassword?.length
  });

  // Cria o usuário com a senha criptografada
  const { password, ...newUser } = (
    await UserModel.create({
      ...inputData,
      userName,
      password: hashedPassword
    })
  ).toObject();

  return newUser;
}

export async function update({ _id, inputData }) {
  const foundUser = await UserModel.findById(_id).exec();
  if (!foundUser) throw new NotFoundError('User not found');

  // Se uma nova senha foi fornecida, criptografá-la
  if (inputData.password) {
    inputData.password = await hashPassword(inputData.password);
  }

  const { password, ...updatedUser } = (await foundUser.set(inputData).save()).toObject();
  return updatedUser;
}

export async function destroy(_id) {
  const foundUser = await UserModel.findById(_id).exec();
  if (!foundUser) throw new NotFoundError('User not found');

  await foundUser.deleteOne();
}
