import bcrypt from "bcryptjs";
import { sessionData } from "../controllers/authController.js";

/**
 * encrypt new password
 * @param {*} password incoming password entered by user to be encrypted
 * @returns encrypted version of password entered
 */

export async function encryptPw(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * this function check user password entered on login screen against encrypted password from database
 * @param {*} password password entered on login screen
 * @param {*} encryptedPw encrpted password from database
 * @returns true or false upon comparison
 */

export async function decryptPW(password, encryptedPw) {
  const result = await bcrypt.compare(password, encryptedPw);
  return result;
}

// protecting routes
export const authentication = (req, res, next) => {
	if (sessionData) {
		next();
	} else {
		res.status(401).json({
			status: "error",
			message: "Invalid user",
		});
	}
};