import mongoose from 'mongoose'
import generateTokenAndSetCookie from '../helpers/generateTokenAndSetCookie.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

const signupUser = async(req, res) => {
     try{

        const {name, email, username, password} = req.body
        const user = await User.findOne({$or:[{email}, {username}]})

        if(user){
            return res.status(400).json({error:'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            username,
            password:hashedPassword,
        })

        await newUser.save()

        if(newUser){

            generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            })
        } else{
            res.status(400).json({error: 'Invaild user data'})
        }

     } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in signupUser', error.message)
     }
}

const loginUser = async(req, res) => {
    try{

        const {username, password} = req.body
        const user = await User.findOne({username})

        if (!user) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!isPasswordCorrect){
            return res.status(404).json({ error: 'Invalid username or password' })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        })

    } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in loginUser', error.message)
    }
}

const logoutUser =(req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 1})
        res.status(200).json({message: "User logged out successfully"})
    } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in logoutUser', error.message)
    }
}

const followunFollowUser = async(req, res) => {
    try{
        const {id} = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if(id === req.user._id.toString()) return res.status(400).json({ error: "You can`t follow/unfollow yourself"})
            
        if(!userToModify || !currentUser) return res.status(400).json({error: "user not found"})    
    
        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})
            res.status(200).json({message: "user unfollowed successfully"})
        } else{
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}})
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
            res.status(200).json({message: "user followed successfully"})
        }
     } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in follow/unfollow', error.message)
    }
}

const updateUser = async(req, res) => {
    try{
        const {name, email, username, password, bio} = req.body
        let {profilePic} = req.body
        const userId = req.user._id
        let user = await User.findById(userId)

        if(!user) return res.status(404).json({ error: 'User not found'})
        if(req.params.id !== userId.toString()) return res.status(400).json({message: 'You can not update other user`s profile'})  
           
        if(password){
            const hashedPassword = await bcrypt.compare(password, 10)
            user.password = hashedPassword
        } 

        if (profilePic) {
            if (user.profilePic) {
              const publicId = user.profilePic.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadResponse.secure_url;
        }
        
        user.name = name || user.name
        user.email = email || user.email
        user.username = username || user.username
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio

        user = await user.save()

        user.password = null

        res.status(200).json({
            message: 'User update successfully',
            user,
        })

    } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in updateUser', error.message)
    }
}

const getUserProfile = async(req, res) => {
    const {query} = req.params
    try{
    let user;
    
    if(mongoose.Types.ObjectId.isValid(query)){
         user = await User.findOne({_id: query}).select("-password").select("-updatedAt")
    } else {
         user = await User.findOne({username: query}).select("-password").select("-updatedAt")
    }
    if(!user) return res.status(404).json({error: "user not found"})

    res.status(200).json(user)
    } catch(error){
        res.status(500).json({error: error.message})
        console.log('Error in getUser', error.message)
    }
}

export {
    signupUser,
    loginUser,
    logoutUser,
    followunFollowUser,
    updateUser,
    getUserProfile
} 