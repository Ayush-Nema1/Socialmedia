import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name :{
    type:String,
    required:true
    },
    username:{
          type : String,
          required: true,
          unique : true
    },
    email:{
         type:String,
         required:true,
         unique:true
    },
  
    active:{
      type:String,
      default:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://res.cloudinary.com/dyuwzqrc7/image/upload/v1771835067/default_eh7ffj_c_crop_w_700_h_700_tjp76s.avif'
    },
    createdAt:{
        type:Date,
          default:Date.now
    },
    token:{
        type:String,
        default:''
    }

});

const User = mongoose.model("User",userSchema);
export default User;
