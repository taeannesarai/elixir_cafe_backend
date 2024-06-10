//imports
import express from "express";
import { viewOrderDetails } from "../controllers/orderDetailsController.js";

export const orderDetailsRouter = express.Router();

//routes

orderDetailsRouter
    .route("/:id")
    .get(viewOrderDetails);// get a single order using unique id