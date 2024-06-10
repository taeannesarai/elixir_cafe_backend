// /**
//  * Filename: 		authRouter.js
//  * Description:     This file define the routes to carry out user registration and and authentication
//  * Developed By: 	Tae Anne Gottshalk
//  * Date: 			2024-05-24
//  */


import express from "express";


import { signup, login, isAuthenticated, getUserProfile} from "../controllers/authController.js";

export const authRouter = express.Router();

// routes
authRouter.route("/signup").post(signup); // signup a user
authRouter.route("/").post(login); // login

authRouter.use(isAuthenticated); //Authentication middleware

authRouter.get("/user-data", getUserProfile); // user profile 
