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
        default:'https://res.cloudinary.com/dyuwzqrc7/image/upload/v1771933974/default-profile-account-unknown-icon-black-silhouette-free-vector_vfotng.jpg'
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
