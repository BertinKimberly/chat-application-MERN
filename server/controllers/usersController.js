import User from "../models/userModel.js";
import bcrypt from "bcrypt";
export const login = async (req, res, next) => {
   try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user)
         return res.json({
            msg: "Incorrect Username or Password",
            status: false,
         });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
         return res.json({
            msg: "Incorrect Username or Password",
            status: false,
         });
      delete user.password;
      return res.json({ status: true, user });
   } catch (ex) {
      next(ex);
   }
};

export const register = async (req, res, next) => {
   try {
      const { username, email, password } = req.body;
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck)
         return res.json({ msg: "Username already used", status: false });
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
         return res.json({ msg: "Email already used", status: false });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
         email,
         username,
         password: hashedPassword,
      });
      delete user.password;
      return res.json({ status: true, user });
   } catch (ex) {
      next(ex);
   }
};

export const getAllUsers = async (req, res, next) => {
   try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
         "email",
         "username",
         "avatarImage",
         "_id",
      ]);
      return res.json(users);
   } catch (ex) {
      next(ex);
   }
};

export const setAvatar = async (req, res, next) => {
   try {
     const userId = req.params.id;
     const userData = await User.findById(userId);
 
     if (!userData) {
       return res.status(404).json({ error: "User not found" });
     }
 
     if (!userData.username) {
       return res.status(400).json({ error: "Username is required to set an avatar" });
     }
 
     const firstInitial = userData.username.charAt(0).toUpperCase();
 
     userData.avatarImage = firstInitial;
     userData.isAvatarImageSet = true;
 
     await userData.save();
 
     return res.json({
       isSet: true,
       image: firstInitial,
     });
   } catch (ex) {
     next(ex);
   }
 };
 

export const logOut = (req, res, next) => {
   try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
   } catch (ex) {
      next(ex);
   }
};
