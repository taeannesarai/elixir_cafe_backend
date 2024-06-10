import { pool } from "../database/dbConnection.js";
import { decryptPW, encryptPw, authentication } from "../utils/auth.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { Email } from "../utils/email.js";

import { cryptoRandomStringAsync } from "crypto-random-string";
import JWT from "jsonwebtoken";

const ranString = await cryptoRandomStringAsync({
  length: 62,
  type: "alphanumeric",
});
console.log(ranString);

// JWT AUTH SETUP
/**
 * Create json web token when a user register
 * @param {*} user object containing user information
 * @returns JWT Token
 */

const signJWTToken = (user) => {
  return JWT.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

export let sessionData;

//signup
export async function signup(req, res, next) {
  // CREATE CUSTOMER
  const sqlQuery = `
    INSERT INTO users( first_name, last_name, email, trn, role, password)
    VALUES (?, ?, ?, ?, ?, ? )
    `;
  const { f_nm, l_nm, eml, trn, pw } = req.body; //get data for form fields
  const rle = "customer";

  console.log(eml);
  console.log(pw);
  console.log(rle);

  // sql query to check if user exist with email provided
  const [isUserExist] = await pool.query(
    `
            SELECT CASE WHEN COUNT(*) > 0 THEN 'true' ELSE 'false' END AS isUserExists
            FROM users
            WHERE email = ?
        `,
    eml
  );

  console.log(isUserExist[0]);

  // if user exists display appropriate message
  if (isUserExist[0].isUserExists == "true") {
    return res.status(400).json({
      status: "error",
      message: "User already registered with provided email",
    });
  }
  // if user does not exist encrypt password and add user to database
  const ePW = await bcrypt.hashSync(pw); // encrypt password entered by user

  const [newUser] = await pool.query(sqlQuery, [
    f_nm,
    l_nm,
    eml,
    trn,
    rle,
    ePW,
  ]); // add user to database

  const uData = { f_nm, l_nm, eml, trn, rle };
  if (newUser.insertId > 0) {
    const token = signJWTToken({
      id: newUser.insertId,
      role: rle,
    });

    // SEND EMAIL
    try {
      const email = new Email(uData);
      email.sendMail("reg_eml", "Welcome to Elixir Cafe", uData);
    } catch (error) {
      console.log("ewmail error", error);
    }
    // SEND EMAIL

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        token,
        user: {
          first_name: f_nm,
          last_name: l_nm,
          email: eml,
          trn: trn,
          role: rle,
        },
      },
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "Registration error",
    });
  }
}

export async function login(req, res, next) {
  const sqlQuery = `
     SELECT * FROM users
        WHERE email = ?
    `;

  const { eml, pw } = req.body; // get data from form input fields

  const [user] = await pool.query(sqlQuery, [eml]); // query to get user data by there email
  console.log(`LOGIN-USER >> ${JSON.stringify(user)}`);
  // check if user for email enetered exists
  if (user.length <= 0) {
    // return appropiate response if the user does not exists
    res.status(401).json({
      status: "INVALID_EMAIL",
      message: "User does not exist.",
    });
  } else {
    // if user exists, check the passord entered agaist the password from database
    const isUser = await decryptPW(pw, user[0].password);
    // if password doesn't match return an error and a suitable message
    if (!isUser) {
      res.status(401).json({
        status: "INVALID_PASSWORD",
        message: "Incorrect passord",
      });
    } else {
      // if password match create session data and return message to confirm user exists
      const token = signJWTToken(user[0]);

      user[0].password = undefined;

      res.status(200).json({
        status: "success",
        message: "Login successfully",
        data: {
          token,
          user: user[0],
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      });
    }
  }
}

// Setup authentication middleware
export const isAuthenticated = async (req, res, next) => {
  const authorization = req.get("Authorization");

  if (!authorization?.startsWith("Bearer")) {
    return next(
      res.status(400).json({
        status: "error",
        message: "Unauthorized user, please login to view content.",
      })
    );
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const [user] = await pool.query(
      `
		SELECT * FROM users 
		WHERE id = ?
	`,
      [decoded.id]
    );

    if (!user.length) {
      return res.status(404).json({
        status: "error",
        message: "Token is invalid or error in validation process",
      });
    }

    const data = user[0];
    data.password = undefined;
    req.user = data;
    next();
  } catch (error) {
    console.log(error);

    if (error.message === "jwt expired") {
      return next(
        res.status(400).json({
          status: "error",
          message: "Token expried",
        })
      );
    } else if (error.message === "jwt malformed") {
      return next(
        res.status(400).json({
          status: "error",
          message: "Token malformed",
        })
      );
    } else if (error.message === "invalid token") {
      return next(
        res.status(400).json({
          status: "error",
          message: "Token is invalid",
        })
      );
    } else {
      return next(
        res.status(400).json({
          status: "error",
          message: "Unkown error",
        })
      );
    }
  }
};

export const getUserProfile = async (req, res, next) => {
  const data = req.user;
  console.log("================= DATA ===============", data);
  const [user] = await pool.query(
    `
		SELECT * FROM users
		WHERE id = ?
	`,
    [data.id]
  );

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
  user[0].password = undefined;

  console.log("userrrr", user);
  res.status(200).json({
    status: "success",
    data: {
      user: user[0],
    },
  });
};

export async function adminCreate(req, res, next) {
  const password = await bcrypt.hashSync("adminone");
  const eml = "adminone@mail.com";
  const sqlQuery = `
    INSERT INTO users( first_name, last_name, email, role, password)
    VALUES ('admin', 'one', '${eml}', 'ADMIN', '${password}' )
    `;

  // sql query to check if user exist with email provided
  const [isUserExist] = await pool.query(
    `
            SELECT CASE WHEN COUNT(*) > 0 THEN 'true' ELSE 'false' END AS isUserExists
            FROM users
            WHERE email = ?
        `,
    eml
  );

  console.log(isUserExist[0]);

  // if user exists display appropriate message
  if (isUserExist[0].isUserExists == "true") {
    console.log("admin Exists");
  } else {
    const [newUser] = await pool.query(sqlQuery); // add admin to database
    if (newUser.insertId > 0) {
      const token = signJWTToken({
        id: newUser.insertId,
        role: rle,
      });

      console.log("admin created");
    }
  }

  next();
}
