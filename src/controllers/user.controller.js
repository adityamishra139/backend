import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{

    const {fullName,email,username,password} = req.body

    if(
        [fullName,email,username,password].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ){
        throw new ApiError(400,"All fields are required")
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim().toLowerCase()

    const existedUser = await User.findOne({
        $or:[{email: normalizedEmail}, {username: normalizedUsername}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    
    //upload to cloudinary

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar")
    }

    const user = await User.create({
        fullName: fullName.trim(),
        avatar: avatar.secure_url || avatar.url,
        coverImage: coverImage?.secure_url || coverImage?.url || "",
        email: normalizedEmail,
        username: normalizedUsername,
        password
    }) 
    const createdUser = await User.findById(user._id).select(
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




const loginUser = asyncHandler(async(req,res)=>{
    const{email,password,username} = req.body
    //check whether the email and password is present
    if(!(email || password)){
        throw new ApiError(400,"Email and password are required")
    }
    //check if the user is present in the database
    const user = await User.findOne({
        email: email.trim().toLowerCase()
    })
    if(!user){
        throw new ApiError(404,"user doesnt exist")
    }

    //check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid password")
    }
    
    //generate access token and refresh token
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    //send cookie

    const options = {
        httpOnly:true,
        secure:true,
    }
    
    return res.status(200).
        cookie("accessToken",accessToken,options).
        cookie("refreshToken",refreshToken,options).
        json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
            
})



const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:null
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )



    
})


export {
    registerUser,
    loginUser,
    logoutUser
}
