import { pool } from "../database/dbConnection.js";

//create payment 
export async function createPayment(req, res, next) {
    let {
        order_id,
        payment_date,
        amount,
        status
    } = req.body;

    //get order cost
    const orderQuery = "SELECT price FROM "
}