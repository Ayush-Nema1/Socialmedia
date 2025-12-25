import {Router} from "express";
import multer from "multer";
import { commentPost, createPost, delete_comment_of_user, deletePost, get_comment_by_post, getAllPosts, increment_like } from "../controllers/posts.controllers.js";

const router = Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    },
})
const upload = multer({storage:storage});

router.route('/posts').post(upload.single('media'),createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost)
router.route('get_comments').get(get_comment_by_post);
router.route('/delete_comment').post(delete_comment_of_user)
router.route('/like').post(increment_like);
export default router;
