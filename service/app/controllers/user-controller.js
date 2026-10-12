import { setResponse, setResponseWithError } from './response-handler.js';
import * as UserService from '../services/user-service.js';

export const register = async (req, res) => {
  try {
    const user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    const response = await UserService.register(user);
    setResponse(res, response);
  } catch (error) {
    setResponseWithError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const user = {};
    user.email = req.body.email;
    user.password = req.body.password;

    const response = await UserService.login(user);

    setResponse(res, response);
  } catch (error) {
    setResponseWithError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password, street, city, state, zip, phone } = req.body;

    const response = await UserService.update(user, {
      name,
      email,
      password,
      street,
      city,
      state,
      zip,
      phone,
    });

    setResponse(res, response);
  } catch (error) {
    setResponseWithError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = req.user;

    const response = await UserService.deleteUser(user);
    setResponse(res, response);
  } catch (error) {
    setResponseWithError(res, error);
  }
};

export const getUserContext = async (req, res) => {
  try {
    const user = req.user;
    const { _id, name, email, phone, street, city, state, zip } = user;
    setResponse(res, { _id, name, email, phone, street, city, state, zip });
  } catch (error) {
    setResponseWithError(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const queryParams = req.query;

    const filteredQuery = {};

    for (const params in queryParams) {
      if (
        Object.hasOwnProperty.call(queryParams, params) &&
        queryParams[params] &&
        queryParams[params] !== ''
      ) {
        const element = queryParams[params];
        filteredQuery[params] = element;
      }
    }

    if (filteredQuery.email) {
      filteredQuery.email = { $regex: filteredQuery.email, $options: 'i' };
    }

    // name contains query
    if (filteredQuery.name) {
      filteredQuery.name = { $regex: filteredQuery.name, $options: 'i' };
    }

    const response = await UserService.getAllUsers(filteredQuery);
    setResponse(res, response);
  } catch (error) {
    setResponseWithError(res, error);
  }
};
