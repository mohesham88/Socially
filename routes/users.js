import express from 'express';
import {
  getUser,
  getUserFollows,
  addRemoveFollow,
} from '../controllers/users.js'

const router = express.Router();


router.get('/:id',  getUser);
router.get('/:id/follows',  getUserFollows)
router.patch('/:id/:followId',  addRemoveFollow)


export default router;