import express from "express";
import cors from "cors";
import morgan from "morgan";

import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5550;
import session from "express-session";


// import routes
import { breakfastMenuRouter } from "./routes/breakfastMenuRouter.js";
import { bevCoffeeMenuRouter } from "./routes/bevCoffeeMenuRouter.js";
import { orderRouter } from "./routes/orderRouter.js";
import{ orderDetailsRouter } from "./routes/orderDetailsRouter.js"
import { authRouter } from "./routes/authRouter.js";
import { paymentRouter } from "./routes/paymentRouter.js"
import { emailRouter } from "./routes/emailRouter.js";
import { adminCreate } from "./controllers/authController.js";


app.all('**', adminCreate);
// Middleware setup

// enables the sharing of data between frontend and backend route
app.options("*", cors(["http://localhost:4200"]));
app.use(cors(["http://localhost:4200"]));

app.use('/uploads', express.static('uploads'));

// allows api to access form data from frontend
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Route handling//
app.use("/api/v1/e_c/beverages/", bevCoffeeMenuRouter); // beverage and coffee menu
app.use("/api/v1/e_c/breakfast/", breakfastMenuRouter); // breakfast menu
app.use("/api/v1/e_c/orderDetails/", orderDetailsRouter); // order details
app.use("/api/v1/e_c/orders/", orderRouter); // order 
app.use("/api/v1/e_c/payment/", paymentRouter); // payments
app.use("/api/v1/auth", authRouter); // auth
app.use("/api/v1/e_c/email", emailRouter); //email



app.listen(port, () => console.log(`server running on --- http://localhost:${port}`));