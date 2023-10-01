import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      occupation,
      email,
      picturePath,
      friends,
      location,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      occupation,
      email,
      picturePath,
      friends,
      location,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      res.status(201).json(savedUser);
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; //so frontend doesnot show password
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
