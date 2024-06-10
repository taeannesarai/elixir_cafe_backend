
//imports
import express from "express";
import multer from "multer"; 

import { createBreakfast, updateBreakfast, getAllBreakfast, getOneBreakfast, deleteBreakfast, rString } from "../controllers/breakfastMenuController.js";

// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
     
    cb(null, rString + "_" + file.originalname);
  }
})

const upload = multer({ storage })

export const breakfastMenuRouter = express.Router();

//routes

breakfastMenuRouter.post('/', upload.single('image'), createBreakfast); //create new breakfast record
breakfastMenuRouter.patch('/:id', upload.single('image'), updateBreakfast); //update single breakfast record using unique id

breakfastMenuRouter
    .route("/")
    .get(getAllBreakfast) //get all order records

// parameterized routes
breakfastMenuRouter
    .route("/:id")
    .get(getOneBreakfast) // get a single order record using unique id
    .delete(deleteBreakfast); //delete a single course record using unique id