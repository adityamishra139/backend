import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{

    const {fullName,email,username,password} = req.body
    console.log("email: ",email)

    if(
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existeduser = User.findOne({
        $or:[{email: email}, {username: username}]
    })
    if(existeduser){
        throw new ApiError(409,"User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log("avatarLocalPath: ",avatarLocalPath)

    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log("coverImageLocalPath: ",coverImageLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }x
    
    //upload to cloudinary

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar")
    }

    const User = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username:username.tolowerCase(),
        password
    }) 
    const createdUser = await User.findbyId(User._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    )



})
    // Logic for registering a user goes here
    //get user detail from FE
    //validation not empty
    //check if the user already exists: username and email
    //file present(avatar) and check for images.
    //upload to cloudinary,avatar
    //create user object - create entry in the database
    //remove password and refresh token field from response
    //response check for success and return the response if made the entry 

    




export {registerUser}