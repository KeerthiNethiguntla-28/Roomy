import AdminUser from '../models/admin-user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (adminUser) => {
  const salt = await bcrypt.genSalt(10);
  adminUser.password = await bcrypt.hash(adminUser.password, salt);

  const res = await AdminUser.create(adminUser);

  if (!res) {
    throw new Error('Admin User not created');
  }

  return { message: 'User created', success: true };
};

export const login = async (adminUser) => {
  const user = await AdminUser.findOne({ email: adminUser.email });
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(adminUser.password, user.password);
  if (!isPasswordValid) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: 2592000,
  });

  return {
    success: true,
    message: 'Admin user logged in',
    token: 'Bearer ' + token,
    user: {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

export const update = async (adminUser, updatedFields) => {
  if (!updatedFields) {
    throw new Error('No fields to update');
  }

  if (updatedFields.password) {
    const salt = await bcrypt.genSalt(10);
    updatedFields.password = await bcrypt.hash(updatedFields.password, salt);
  }

  const res = await AdminUser.updateOne({ _id: adminUser._id }, updatedFields);

  const user = await AdminUser.findById(adminUser._id);

  if (!res) {
    throw new Error('Admin User not updated');
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: 2592000,
  });

  return {
    message: 'Admin User updated',
    success: true,
    token: 'Bearer ' + token,
    user: {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

export const deleteAdminUser = async (adminUser) => {
  const res = await AdminUser.deleteOne({ email: adminUser.email });

  if (!res) {
    throw new Error('Admin User not deleted');
  }

  return { message: 'Admin User deleted', success: true };
};

export const getAdminUserById = async (id) => {
  const res = await AdminUser.findById(id);

  if (!res) {
    throw new Error('Admin User not found');
  }

  return res;
};
