import {Router} from "express";
import { login, register, uploadProfilePicture,updateUserProfile,getUserAndProfile,updateProfileData,getAllUserProfile, downloadProfile, sendConnectionRequest, getmyConnectionRequests,whatAreMyConnections, acceptConnectionRequest } from "../controllers/user.controllers.js";
import multer from "multer"
const router = Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload = multer({storage : storage})

router.route("/update_profile_picture").post(upload.single('profile_picture'),uploadProfilePicture);


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route("/users/get_all_users").get(getAllUserProfile);
router.route("/user/dowmload_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getmyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);

export default router;