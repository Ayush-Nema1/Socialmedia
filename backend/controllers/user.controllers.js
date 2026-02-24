import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import pdfDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import path from "path";


const convertUserDataToPDF = (userData, res) => {
  const doc = new pdfDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${userData.userId.username}_resume.pdf`
  );

  doc.pipe(res);

  doc.moveDown(2);
  doc.fontSize(16).text("Resume", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.text(`Email: ${userData.userId.email}`);
  doc.text(`Username: ${userData.userId.username}`);
  doc.moveDown();

  doc.text("Past Work:");
  userData.pastWork.forEach((work) => {
    doc.text(`Company: ${work.company}`);
    doc.text(`Position: ${work.position}`);
    doc.text(`Years: ${work.years}`);
    doc.moveDown();
  });

  doc.text("Education:");
  userData?.education?.forEach((edu) => {
    doc.text(`School: ${edu.school}`);
    doc.text(`Degree: ${edu.degree}`);
    doc.text(`Field: ${edu.fieldOfStudy}`);
    doc.moveDown();
  });

  doc.end();
};

export const register = async (req, res) => {
  try {
    console.log("REQ BODY =", req.body);
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All feilds required" });
    }
    const user = await User.findOne({
      email,
    });
    if (user) return res.status(400).json({ message: "User already register" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();
    const profile = new Profile({ userId: newUser._id });
    await profile.save();
    return res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All feild required" });
    const user = await User.findOne({
      email,
    });
    if (!user) return res.status(404).json({ message: "User not exist" });
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({ token });
  } catch {}
};
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
     console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });

   user.profilePicture = req.file.path;
    await user.save();
    return res.json({ message: "profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// export const updateUserProfile = async (req, res) => {
//   try {
//     const { token, ...newUserData } = req.body;

//     const user = await User.findOne({ token });
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     const { username, email } = newUserData;
//     const exsitingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (exsitingUser) {
//       if (exsitingUser && String(exsitingUser._id) !== String(user._id)) {
//         return res.status(400).json({ message: "User already exist" });
//       }
//       Object.assign(user, newUserData);
//       await user.save();
//       return res.json({ message: "userUpdated" });
//     } else {
//       return res.json({ message: "user not exist" });
//     }
//   } catch (error) {
//     console.log("iam cakkl")
//     return res.status(500).json({ message: error.message });
//   }
// };

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (newUserData.username || newUserData.email) {
      const existingUser = await User.findOne({
        $or: [
          newUserData.username ? { username: newUserData.username } : {},
          newUserData.email ? { email: newUserData.email } : {},
        ],
      });

      if (
        existingUser &&
        String(existingUser._id) !== String(user._id)
      ) {
        return res.status(400).json({ message: "User already exist" });
      }
    }

   Object.keys(newUserData).forEach((key) => {
  if (newUserData[key] !== undefined && newUserData[key] !== null) {
    user[key] = newUserData[key];
  }
});
    await user.save();

    return res.json({ message: "userUpdated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






export const getUserAndProfile = async (req, res) => {
  try {
   
    const { token } = req.query;
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    console.log("iam working");
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log( userProfile._id)
    const profile_to_update = await Profile.findOne({ userId: userProfile._id });
    console.log(profile_to_update)
console.log("BODY:", newProfileData);

    Object.keys(newProfileData).forEach((key) => {
  if (
    newProfileData[key] !== undefined &&
    newProfileData[key] !== null
  ) {
    profile_to_update[key] = newProfileData[key];
  }
});

    await profile_to_update.save();
    return res.json({ message: "Profile saved ccessfully" });
  } catch (error) {
    console.log("i am error")
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  try {
    if (!user_id) {
      return res.status(400).json({ message: "User id is required" });
    }

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found for this user",
      });
    }

    convertUserDataToPDF(userProfile, res);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "user not fond" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const exsitingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (exsitingRequest) {
      return res.json({ message: "Request already sent" });
    }

    const request = await ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getmyConnectionRequests = async (req, res) => {
  const { token } = req.query;
  try {
    const user = User.findOne({token});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const connections = await ConnectionRequest.find({userId : user._id})
    .populate('connectionId','name username email profilePicture');
    return res.json({connections})

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async(req,res)=>{
    const { token } = req.query;
    try {
      const user = await User.findOne({token});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const connections = await ConnectionRequest.find({connectionId: user._id}).populate('userId','name username email profilePicture');
    return res.json({connections});

    } catch (error) {
     return res.status(500).json({ message: error.message });
    }

}
export const acceptConnectionRequest = async(req,res)=>{
const {token , requestId,actiontype} = req.body;
try{
const user = await User.findOne({token});
if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const connection = await ConnectionRequest.findOne({_id: requestId});
    if(!connection){
      return res.josn({message:"connection not found"});
    }
    if(actiontype == "accept"){
      connection.status_accepted = true;
    }else{
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({message : "requset Accepted"});
}catch (error) {
     return res.status(500).json({ message: error.message });
    }
}

export const getUserbyusername = async(req,res)=>{
  const {username} = req.query;

  try {
     const user = await User.findOne({
      username
     })
     if(!user){
      return res.status(404).json({message:"User not found"})
     }
     const userProfile = await Profile.findOne({userId:user._id})
     .populate('userId','name username email profilePicture');

     return res.json({"profile" : userProfile})
  } catch (error) {
         return res.status(500).json({ message: error.message });

  }
}