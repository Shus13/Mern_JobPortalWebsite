const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ← yo add bhayo

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
    },
  });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error"
    })
  } 
};

module.exports = { registerUser, loginUser };
