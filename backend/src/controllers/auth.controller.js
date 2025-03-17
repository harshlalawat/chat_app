import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";

export const signup = async (req, res) => {
    try{
        const { userName, email, password } = req.body;
        if(!userName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({userName, email, password: hashedPassword});

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(200).json({
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                profile: newUser.profilePic
            });
        } else {
            return res.status(400).json({message: "Invalid User Data"});
        }

    }catch(error){
        console.log(`Error in signup controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profile: user.profilePic
        });
    }catch(error){
        console.log(`Error in login controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie("jwt");
        return res.status(200).json({message: "Logged out successfully"});
    }catch(error){
        console.log(`Error in logout controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        return res.status(200).json(req.user);
    }catch(error){
        console.log(`Error in check auth controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}