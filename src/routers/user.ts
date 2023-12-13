import express from 'express';

import { getAllUsers } from '../controllers/user';
import { isAuthenticated } from '../middlewares/auth';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
};