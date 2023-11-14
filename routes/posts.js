import express from 'express';
import {postsUploader} from '../middleware/uploader.js';
import { createPost, getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
const upload = postsUploader();
const router = express.Router();


router.get('/', getFeedPosts);
router.post('/', upload.single('picture') , createPost);


router.get('/:userId', getUserPosts);

// like post
router.patch('/:postId/like', likePost)





export default router;