// imports
import multer from "multer";
import express from "express";
import {
  createBeverage,
  getSingleBeverage,
  getAllBeverages,
  updateBeverage,
  deleteBeverage,
  rString,
} from "../controllers/bevCoffeeMenuController.js";


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

export const bevCoffeeMenuRouter = express.Router();

//routes
bevCoffeeMenuRouter.post('/', upload.single('image'), createBeverage); // create new beverage record
bevCoffeeMenuRouter.patch("/:id", upload.single("image"), updateBeverage); // update single beverage record using unique id

bevCoffeeMenuRouter
    .route("/")
    .get(getAllBeverages) //get all records

// parameterized routes
bevCoffeeMenuRouter
    .route("/:id")
    .get(getSingleBeverage) // get a single record using unique id
    .delete(deleteBeverage); //delete a single record using unique id