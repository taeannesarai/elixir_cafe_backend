import { pool } from "../database/dbConnection.js";

import cryptoRandomString from "crypto-random-string";
export const rString = cryptoRandomString({length: 10, type: 'alphanumeric'});


//create beverage record

export async function createBeverage(req, res, _next) {
     console.log("file", req.file);
     let img;
     if (!req.file) {
       img = "";
     } else {
       img = rString + "_" + req.file.originalname;
     }
	const sqlQuery = `
 INSERT INTO  beverages_menu(item_name, description, image, price)
 VALUES (?, ?, ?, ?)
 `;   
	
 const { item_nm, descrip, prce } = req.body;
    try {

        const [newBevCo] = await pool.query(sqlQuery, [item_nm, descrip, img, prce]);

        res.status(201).json({
			status: "success",
			newBevCoId: newBevCo.insertId,
		});
	} catch (error) {
		console.log(error);

		res.status(404).json({
			status: "error",
			message: "Failed to create new course.",
		});
	}
}

//update beverage record
// update breakfast
export async function updateBeverage(req, res, _next) {
  let img;
  console.log("UPDATE IMG: ", req.file);

  if (!req.file) {
    img = req.body.img;
  } else {
    img = rString + "_" + req.file.originalname;
  }

  const sqlQuery = `
    UPDATE beverages_menu
    SET item_name = ?, description = ?, image = ?, price = ?
    WHERE id = ?
    `;

  const bcId = req.params.id;

  const { item_nm, descrip, prce } = req.body;
  try {
    const [uBeverage] = await pool.query(sqlQuery, [
      item_nm,
      descrip,
      img,
      prce,
      bcId,
    ]);
    if (uBeverage.affectedRows <= 0) {
      res.status(404).json({
        status: "error",
        message: " No such record to update.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: { changes: uBeverage.affectedRows, id: bcId },
      });
    }
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Failed to update breakfast record.",
    });
  }
}

//get all breakfast

export async function getAllBreakfast(req, res, _next) {
  const sqlQuery = `SELECT * FROM breakfast_menu`;

  try {
    const [breakfast_menu] = await pool.query(sqlQuery);

    if (breakfast_menu.length <= 0) {
      res.status(200).json({
        status: "error",
        message: "No breakfast menu records to retrieve.",
      });
    } else {
      res.status(200).json({
        status: "success",
        recordCount: breakfast_menu.length,
        data: { breakfast_menu },
      });
    }
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Failed to retrieve records.",
    });
  }
}

export async function getOneBreakfast(req, res, _next) {
  const sqlQuery = `
    SELECT * FROM breakfast_menu
    WHERE id = ?
    `;

  const bId = req.params.id;

  try {
    const [breakfast] = await pool.query(sqlQuery, [bId]);

    if (breakfast.length <= 0) {
      res.status(404).json({
        status: "error",
        message: "There are no records available.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: breakfast[0],
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: " Failed to retrieve records.",
    });
  }
}

//get all beverages 
export async function getAllBeverages(req, res, _next) {
    const sqlQuery = `SELECT * FROM beverages_menu`;

    try {
        const [beverages_menu] = await pool.query(sqlQuery);

        if (beverages_menu.length <= 0) {
            res.status(200).json({
                status: "error",
                message: "No beverage menu records to retrieve.",
            });
        } else {
            res.status(200).json({
                status: "success",
                recordCount: beverages_menu.length,
                data: { beverages_menu },
            });
        }
    } catch (error) {
        console.log(error);

        res.status(404).json({
            status: "error",
            message: "Failed to retrieve records.",
        });
    }
}

// get single beverage record
export async function getSingleBeverage(req, res, _next) {
     const sqlQuery = `
    SELECT * FROM beverages_menu
    WHERE id = ?
    `;

    const bevCoId = req.params.id;

    try {
        const [beverage] = await pool.query(sqlQuery, [bevCoId]);

        if (beverage.length <= 0) {
            res.status(404).json({
                status: "error",
                message: "There are no records available.",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: beverage[0],
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "error",
            message: " Failed to retrieve records.",
        });
    }
}


//delete single beverage record
export async function deleteBeverage(req, res, _next) {
    const sqlQuery = `
    DELETE FROM beverages_menu
    WHERE id = ?
    `;

    const bevCoId = req.params.id;

	try {
		const [deleteBevCo] = await pool.query(sqlQuery, [bevCoId]);

		if (deleteBevCo.affectedRows <= 0) {
			res.status(404).json({
				status: "error",
				message: "Record does not exist.",
			});
		} else {
			res.status(200).json({
				status: "success",
				message: "Record deleted successfully.",
				deletedRecordId: deleteBevCo.affectedRows,
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

