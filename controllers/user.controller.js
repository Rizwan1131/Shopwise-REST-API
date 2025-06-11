import UserModel from "../models/User.Model.js";
import sendErrorResponse from "../utils/sendError.js";
import sendEmail from "../utils/sendMail.js";
import sendResponse from "../utils/sendRes.js";
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
const JWT_SECRET = process.env.JWT_SECRET
config()


export const createUser = async (req, res) => {
    try {
        const { username, role, email, password } = req.body;
        if (!username || !email || !password) {
            return sendResponse(res, 400, false, "All feilds are required")
        }
        const verificationToken = crypto.randomBytes(20).toString('hex');
        // check if user alredy exsit or not
        const user = await UserModel.findOne({ email: email });
        if (user) {
            return sendResponse(res, 400, false, "User alredy exits with this email");
        }
        const hashedPass = await bcrypt.hash(password, 10)
        // create an enrty in db
        const newUser = await UserModel.create({
            username, role, email, password: hashedPass, verificationToken
        })

        // send conformation email
        const link = `${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}`;
        await sendEmail(email, 'Verify Your Email', `Click here to verify: ${link}`);

        return res.status(200).json({
            message: "Sign Up successfully, Please check your email and verify"
        })
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token
        const user = await UserModel.findOne({ verificationToken: token });
        if (!user) return res.status(400).send("Invalid token");

        user.isVerified = true;
        user.verificationToken = undefined; // clear token
        await user.save();
        res.send("Email verified successfully! You can now log in.");
    } catch (err) {
        console.log("error in verifying email", err)
        res.status(500).send("Server error");
    }
};


export const login = async (req, res) => {
    try {
        
        const { email, password } = req.body
        if (!email || !password) {
            return sendResponse(res, 400, false, "All feilds are required");
        }
        // check if user esxits or not
        const user = await UserModel.findOne({email});
        
        if (!user) {
            return sendResponse(res, 400, false, "User not found with this email");
        }

        if (!user.isVerified) {
            return sendResponse(res, 400, false, "Email is not verifed");
        }
        const matchedPass = await bcrypt.compare(password, user.password)
        if (!matchedPass) {
            return sendResponse(res, 400, false, "Incerrect password");
        }
        // generate jwt token
        const payload = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
        console.log("Jwt toekn", token);
        res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({
            message: "Login seccessfully",
            token: token
        })

    } catch (error) {
        console.log("Error while loging", error)
        return sendErrorResponse(res, 500, error.message);
    }
}