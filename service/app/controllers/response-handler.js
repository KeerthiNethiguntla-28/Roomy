import logger from '../utils/logger.js';

export const setResponse = (response, object) => {
  return response.status(200).json(object);
};

export const setResponseWithError = (response, error) => {
  logger.error(error.stack);

  const status = error.status || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
  return response.status(status).json({
    message: status >= 500 ? 'Internal server error' : error.message,
    code: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
  });
};
