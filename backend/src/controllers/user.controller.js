import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";

export const updateProfile = async (req, res) => {
    try{
        const { profilePic } = req.body;
        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadedResult = await cloudinary.uploader.upload(profilePic);
        
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadedResult.secure_url}, {new: true});

        return res.status(200).json(updatedUser);
    }catch(error){
        console.log(`Error in update profile controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const loggedInUser = req.user;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser._id}}).select("-password");
        return res.status(200).json(filteredUsers);
    }catch(error){
        console.log(`Error in get all users controller : ${error.message}`);
        res.status(500).json({message: "Internal Server Error"});
    }
}