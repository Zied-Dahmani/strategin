import express from 'express';

import user from './user';
import auth from './auth';

const router = express.Router();

export default (): express.Router => {
  auth(router);
  user(router);
  return router;
};