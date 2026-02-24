import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import pdfDocument from "pdfkit";
import ConnectionRequest from "../models/connections.model.js";
// import fetch from "node-fetch";

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

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
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= PROFILE PICTURE ================= */

export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.path; // Cloudinary URL
    await user.save();

    return res.json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET USER + PROFILE ================= */

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture bio"
    );

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DOWNLOAD RESUME ================= */

export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  try {
    if (!user_id) {
      return res.status(400).json({ message: "User id is required" });
    }

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture bio"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const doc = new pdfDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${userProfile.userId.username}_resume.pdf`
    );

    doc.pipe(res);

    /* Profile Picture from Cloudinary */
    if (userProfile.userId.profilePicture) {
      try {
        const imageResponse = await fetch(
          userProfile.userId.profilePicture
        );
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        doc.image(buffer, { width: 100 });
        doc.moveDown();
      } catch {
        console.log("Image skipped");
      }
    }

    doc.fontSize(18).text(userProfile.userId.name);
    doc.moveDown();

    doc.fontSize(12).text(`Email: ${userProfile.userId.email}`);
    doc.moveDown();

    if (userProfile.userId.bio) {
      doc.text(`Bio: ${userProfile.userId.bio}`);
      doc.moveDown();
    }

    doc.fontSize(14).text("Work History");
    doc.moveDown();

    userProfile.pastWork?.forEach((work) => {
      doc.text(`Company: ${work.company}`);
      doc.text(`Position: ${work.position}`);
      doc.text(`Years: ${work.years}`);
      doc.moveDown();
    });

    doc.fontSize(14).text("Education");
    doc.moveDown();

    userProfile.education?.forEach((edu) => {
      doc.text(`School: ${edu.school}`);
      doc.text(`Degree: ${edu.degree}`);
      doc.text(`Field: ${edu.fieldOfStudy}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};