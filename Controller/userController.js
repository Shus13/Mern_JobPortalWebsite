const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const path = require("path");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if(!name || !email || !password || !role){
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const existingUser = await User.findOne({ 
      where: { 
        email: email 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error"
    })
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email 
      } 
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

  // JWT token generate gareko
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: "7d" 
      },
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      resume: user.resume
    },
  });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error"
    })
  } 
};

const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }
    const filePath = `/uploads/profile-photos/${req.file.filename}`;
    req.user.profilePhoto = filePath;
    await req.user.save();

    res.status(200).json({
      message: "Profile photo updated",
      profilePhoto: filePath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateResume = async (req, res) => {
  try {
    if (req.user.role !== "JobSeeker") {
      return res.status(403).json({
        message: "Only job seekers can upload a resume",
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }
    const filePath = `/uploads/resumes/${req.file.filename}`;
    req.user.resume = filePath;
    await req.user.save();

    res.status(200).json({
      message: "Resume updated",
      resume: filePath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profilePhoto: req.user.profilePhoto,
      resume: req.user.resume,
    },
  });
};

const downloadResume = async (req, res) => {
  try {
    if (!req.user.resume) {
      return res.status(404).json({ message: "No resume uploaded" });
    }
    const filePath = path.join(__dirname, "..", req.user.resume);
    res.download(filePath, `${req.user.name}-resume${path.extname(filePath)}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (email !== req.user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }
    req.user.name = name;
    req.user.email = email;
    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePhoto: req.user.profilePhoto,
        resume: req.user.resume,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Hirely password",
      html: `
        <p>You requested a password reset.</p>
        <p>This link expires in 30 minutes:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ where: { resetPasswordToken: hashedToken } });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. Please log in." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfilePhoto,
  updateResume,
  getProfile,
  downloadResume,
  updateProfile,
  forgotPassword,
  resetPassword
};

