import { pool } from "../database/dbConnection.js";



export async function viewOrderDetails(req, res, _next) {
    const sqlQuery = `
    SELECT 
    o.id AS order_id,
    u.first_name,
    u.last_name,
    o.order_date,
    o.total_amount,
    o.status,
    bm.item_name AS breakfast_item_name,
    bev.item_name AS beverage_item_name,
    od.quantity
FROM 
    orders o
JOIN 
    users u ON u.id = o.user_id
JOIN 
    order_details od ON o.id = od.order_id
JOIN 
    breakfast_menu bm ON od.breakfast_id = bm.id
JOIN 
    beverages_menu bev ON od.beverages_id = bev.id;

    `;
     try {
       const [orderd] = await pool.query(sqlQuery);

       if (orderd.length <= 0) {
         res.status(200).json({
           status: "error",
           message: "No order records to retrieve.",
         });
       } else {
         res.status(200).json({
           status: "success",
           recordCount: orderd.length,
           data: { orderd },
         });
       }
     } catch (error) {
       console.log(error);

       res.status(404).json({
         status: "error",
         message: "Failed to retrieve orders.",
       });
     }
}

