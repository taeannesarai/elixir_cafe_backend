import nodemailer from "nodemailer";

export const sendEmailAfterSignup = (req, res) => {
    const user = req.body.user; // Assuming user data is passed in req.body

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email content
    const mailOptions = {
        from: "your-mailtrap-inbox@example.com",
        to: user.email,
        subject: "Welcome to Our Platform!",
        text: `
            Dear ${user.firstName} ${user.lastName},
            
            Thank you for signing up with us! We're excited to have you on board.
            
            Best regards,
            The Team
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
        } else {
            console.log("Email sent:", info.response);
            res.status(200).send("Email sent successfully");
        }
    });
};