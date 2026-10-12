import express from 'express';
import { passportAdminUserAuth } from '../utils/passportAuth.js';

import * as AdminUserController from '../controllers/admin-user-controller.js';

const AdminUserRouter = express.Router();

AdminUserRouter.post('/login', AdminUserController.login);
// Admin accounts are provisioned using npm run seed:admin; no public registration.
AdminUserRouter.put(
  '/:id',
  (req, res, next) => {
    passportAdminUserAuth(req, res, next);
  },
  AdminUserController.update
);
AdminUserRouter.delete(
  '/delete',
  (req, res, next) => {
    passportAdminUserAuth(req, res, next);
  },
  AdminUserController.deleteUser
);

export default AdminUserRouter;
