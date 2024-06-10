import express from "express";

import { Email } from "../utils/email.js";

export const emailRouter = express.Router();

// Login route
emailRouter.post("/login", async (req, res) => {
	try {
		// Assuming you have the user data available after successful login
		const { email, first_name, last_name } = req.body;

			// Create an instance of Email class
			const emailSender = new Email({ email, first_name, last_name });

			// Prepare email data
			const template = "login";
			const subject = "Login Successful";
		

			// Send the login email
			await emailSender.sendMail(template, subject, user);

		// Return successful login response
		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ error: "Failed to login" });
	}
});

emailRouter.post("/new-registration-mail", async (req, res) => {
	const { first_name, last_name, email } = req.body;
	try {
		const emailService = new Email({ first_name, last_name, email });

		const logoUrl = "http://localhost:4200/assets/images/CoffeeShoplogo.png"; // Update this with your actual logo URL

		const emailContent = `
			<center>
			<img src="${logoUrl}" alt="Coffe shop Logo" style="display: block; max-width: 200px; margin: 0 auto;">
			</center>
			<p>Dear ${first_name} ${last_name},</p>
			<p>
				Welcome to Elixir Cafe! We are thrilled to have you join our community of coffee enthusiasts and lovers of great ambiance. 
                Your journey with us begins now, and we can't wait to share our passion for exceptional coffee, delectable treats, and a warm, inviting atmosphere.
			</p>
			<p>
				Here's a sneak peek of what awaits you:

Artisanal Coffee: Indulge in our carefully crafted brews made from the finest beans sourced from around the world.
Gourmet Delights: Treat yourself to our assortment of mouthwatering pastries, sandwiches, and desserts, freshly prepared to tantalize your taste buds.
Cozy Ambiance: Relax and unwind in our cozy cafe environment, the perfect spot to catch up with friends, dive into a good book, or simply savor a moment of tranquility.
			</p>

			<p>
				At Elixir Cafe, we're committed to providing you with an unforgettable experience every time you walk through our doors.
            <br>
                If you have any questions or need assistance, feel free to reach out to our friendly team at [Contact Email] or give us a call at [Contact Number].
			<br>
            Thank you for choosing Elixir Cafe. We can't wait to serve you!
            
            </p>
			<p>Best regards,
            <br> Management
            </p>
			<p>Elixir Cafe</p>
	  `;

		await emailService.sendMail("Welcome to Elixir Cafe!- Indulge in the Magic of Every Sip!", emailContent);
		res.status(200).json({
			status: "success",
			message: "Registration email sent successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			status: "error",
			message: "Failed to send registration email",
		});
	}
});
