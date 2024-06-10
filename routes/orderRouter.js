//  imports
import express from "express";
import { createOrder, updateOrder, getSingleOrder, getAllOrders, deleteOrder } from "../controllers/orderController.js";


export const orderRouter = express.Router();

//routes

orderRouter
    .route("/")
    .get(getAllOrders) //get all order records
    .post(createOrder); //create new order record

// parameterized routes
orderRouter
    .route("/:id")
    .get(getSingleOrder) // get a single order record using unique id
    .patch(updateOrder) //update single order record using unique id
    .delete(deleteOrder); //delete a single course record using unique id