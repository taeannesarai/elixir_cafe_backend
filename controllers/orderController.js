import { pool } from "../database/dbConnection.js";

//create an order
export async function createOrder(req, res, _next) {
    const sqlQuery = `
    INSERT INTO orderS(user_id, order_date, total_amount, status) 
    VALUES (?, CURRENT_TIMESTAMP(), ?, ?) 
    `;

    const oDetailsQuery = `
        INSERT INTO order_details (order_id, breakfast_id, beverages_id, quantity)
        VALUES (?, ?, ?, ?)
    `;

    try {
        const { u_id, order_date, total_amount, status, breakfast_item_name, beverage_item_name, quantity } = req.body;
    //  let date = new Date(order_date).toISOString().split(" ")[0] + "00:00:00";
        const [newOrder] = await pool.query(sqlQuery, [u_id, total_amount, status]);
        if (newOrder) {
            const [newODetails] = await pool.query(oDetailsQuery, [
              newOrder.insertId,
              breakfast_item_name,
              beverage_item_name,
              quantity,
            ]); 
        }

        res.status(201).json({
            status: 'success',
            orderId: newOrder.insertId,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "error",
            message: "Failed to create new order.",
        });
    
    }
}



export async function updateOrder(req, res, _next) {
  const sqlQuery = `
    UPDATE orders
    (user_id, order_date, total_amount, status)
    VALUES (?, CURRENT_TIMESTAMP(), ?, ?) 
    `;

  const oDetailsQuery = `
        INSERT INTO order_details (order_id, breakfast_id, beverages_id, quantity)
        VALUES (?, ?, ?, ?)
    `;

  try {
    const {
      u_id,
      order_date,
      total_amount,
      status,
      breakfast_item_name,
      beverage_item_name,
      quantity,
    } = req.body;
    //  let date = new Date(order_date).toISOString().split(" ")[0] + "00:00:00";
    const [newOrder] = await pool.query(sqlQuery, [u_id, total_amount, status]);
    if (newOrder) {
      const [newODetails] = await pool.query(oDetailsQuery, [
        newOrder.insertId,
        breakfast_item_name,
        beverage_item_name,
        quantity,
      ]);
    }

    res.status(201).json({
      status: "success",
      orderId: newOrder.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      message: "Failed to create new order.",
    });
  }
}

    
//get all orders
export async function getAllOrders(req, res, _next) {
    const sqlQuery = `
    SELECT o.*, u.first_name, u.last_name
FROM orders o
JOIN users u ON u.id = o.user_id;
    `;

    try {
        const [order] = await pool.query(sqlQuery);

        if (order.length <= 0) {
            res.status(200).json({
                status: "error",
                message: "No order records to retrieve."
            });
        } else {
            res.status(200).json({
                status: "success",
                recordCount: order.length,
                data: { order },
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


export async function getSingleOrder(req, res, _next) {
     const sqlQuery = `
    SELECT * FROM orders
    WHERE id = ?
    `;

     const oId = req.params.id;

     try {
       const [order] = await pool.query(sqlQuery, [oId]);

       if (order.length <= 0) {
         res.status(404).json({
           status: "error",
           message: "There are no records available.",
         });
       } else {
         res.status(200).json({
           status: "success",
           data: order[0],
         });
       }
     } catch (error) {
       res.status(404).json({
         status: "error",
         message: " Failed to retrieve records.",
       });
     }
}

export async function deleteOrder(req, res, _next) {
   const sqlQuery = `
    DELETE FROM orders
    WHERE id = ?
    `;

   const oId = req.params.id;

   try {
     const [dOrder] = await pool.query(sqlQuery, [oId]);

     if (dOrder.affectedRows <= 0) {
       res.status(404).json({
         status: "error",
         message: "Record does not exist.",
       });
     } else {
       res.status(200).json({
         status: "success",
         message: "Record deleted successfully.",
         deletedRecordId: dOrder.affectedRows,
       });
     }
   } catch (error) {
     console.log(error);

     res.status(404).json({
       status: "error",
       message: "Failed to delete record.",
     });
   }   
}