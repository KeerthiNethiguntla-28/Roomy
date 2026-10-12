import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/azureUtils.js';
import { renderWelcomeEmail } from '../templates/user-templates.js';

export const register = async (user) => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const res = await User.create(user);

  if (!res) {
    throw new Error('User not created');
  }

  sendEmail(
    [user.email],
    'Welcome',
    'Welcome to our platform',
    renderWelcomeEmail(user.name)
  );
  return { message: 'User created', success: true };
};

export const login = async (user) => {
  const userFromDb = await User.findOne({ email: user.email });
  if (!userFromDb) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(user.password, userFromDb.password);
  if (!isPasswordValid) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const token = jwt.sign(
    { id: userFromDb._id, email: userFromDb.email },
    process.env.JWT_SECRET,
    {
      expiresIn: 2592000,
    }
  );

  return { success: true, message: 'User logged in', token: 'Bearer ' + token };
};

export const update = async (user, updatedFields) => {
  if (updatedFields.password) {
    const salt = await bcrypt.genSalt(10);
    updatedFields.password = await bcrypt.hash(updatedFields.password, salt);
  }

  const res = await User.updateOne({ email: user.email }, updatedFields);

  if (!res) {
    throw new Error('User not updated');
  }

  return { message: 'User updated', success: true };
};

export const deleteUser = async (user) => {
  const res = await User.deleteOne({ email: user.email });

  if (!res) {
    throw new Error('User not deleted');
  }

  return { message: 'User deleted', success: true };
};

export const getUserById = async (id) => {
  const res = await User.findById(id);

  if (!res) {
    throw new Error('User not found by id');
  }

  return res;
};

export const getUser = async (query) => {
  const res = await User.findOne(query);

  if (!res) {
    throw new Error('User not found getUser');
  }

  return res;
};

export const getAllUsers = async (query = {}) => {
  const res = await User.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'user',
        as: 'posts',
      },
    },
    {
      $lookup: {
        from: 'paymentsubscriptions',
        localField: '_id',
        foreignField: 'user',
        as: 'paymentSubscription',
      },
    },
    {
      $project: {
        _id: 1,
        email: 1,
        name: 1,
        numberOfPosts: { $size: '$posts' },
        paymentSubscriptions: '$paymentSubscription',
      },
    },
  ]);

  if (!res) {
    throw new Error('Users not found');
  }

  // set subscription status if status === active and endDate > new Date().getTime()
  res.forEach((user) => {
    user.paymentSubscriptions.forEach((subscription) => {
      if (
        subscription.status === 'active' &&
        subscription.endDate > new Date().getTime()
      ) {
        user.subscriptionStatus = 'active';
      }
    });

    if (!user.subscriptionStatus) {
      user.subscriptionStatus = 'inactive';
    }

    delete user.paymentSubscriptions;
  });

  return res;
};

export const getUsersCreatedLast30Days = async () => {
  const res = await User.find({
    createdAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
    },
  });

  if (!res) {
    throw new Error('Users not found');
  }

  return res;
};

export const getUsersCreatedBetween = async (startDate, endDate) => {
  const res = await User.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  if (!res) {
    throw new Error('Users not found');
  }

  return res;
};
