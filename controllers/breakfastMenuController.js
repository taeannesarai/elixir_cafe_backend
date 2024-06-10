import { pool } from "../database/dbConnection.js";

import cryptoRandomString from "crypto-random-string";
export const rString = cryptoRandomString({ length: 10, type: "alphanumeric" });

// create breakfast
export async function createBreakfast(req, res, _next) {
  // console.log('file', req.file);
  let img;
  if (!req.file) {
    img = "";
  } else {
    img = rString + "_" + req.file.originalname;
  }
  const sqlQuery = `
    INSERT INTO breakfast_menu (item_name, description, image, price)
    VALUES(?, ?, ?, ?)
    `;

  const { item_nm, descrip, prce } = req.body;
  // prevent server from crashing if it encounters an error while running query
  try {
    const [newBreakfast] = await pool.query(sqlQuery, [
      item_nm,
      descrip,
      img,
      prce,
    ]);

    res.status(201).json({
      status: "success",
      newBreakfastId: newBreakfast.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: "error",
      message: "Failed to add breakfast.",
    });
  }
}

// update breakfast
export async function updateBreakfast(req, res, _next) {
  let img;
  console.log("UPDATE IMG: ", req.file);

  if (!req.file) {
    img = req.body.img;
  } else {
    img = rString + "_" + req.file.originalname;
  }

  const sqlQuery = `
    UPDATE breakfast_menu
    SET item_name = ?, description = ?, image = ?, price = ?
    WHERE id = ?
    `;

  const bId = req.params.id;

  const { item_nm, descrip, prce } = req.body;
  try {
    const [uBreakfast] = await pool.query(sqlQuery, [
      item_nm,
      descrip,
      img,
      prce,
      bId,
    ]);
    console.log("update: ", {
      item_nm: item_nm,
      descrip: descrip,
      img: img,
      prce: prce,
      bId: bId,
    });
    if (uBreakfast.affectedRows <= 0) {
      res.status(404).json({
        status: "error",
        message: " No such record to update.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: { changes: uBreakfast.affectedRows, id: bId },
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

//delete single breakfast
export async function deleteBreakfast(req, res, _next) {
  const sqlQuery = `
    DELETE FROM breakfast_menu
    WHERE id = ?
    `;

  const bId = req.params.id;

  try {
    const [deleteBreakfast] = await pool.query(sqlQuery, [bId]);

    if (deleteBreakfast.affectedRows <= 0) {
      res.status(404).json({
        status: "error",
        message: "Record does not exist.",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Record deleted successfully.",
        deletedRecordId: deleteBreakfast.affectedRows,
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
