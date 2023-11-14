import  express  from "express";
import {login,register}  from '../controllers/auth.js'
import {profilePicturesUploader} from '../middleware/uploader.js';
const router = express.Router();
const upload = profilePicturesUploader();



router.post('/register', upload.single('picture') , register);
router.post('/login',login);




export default router;