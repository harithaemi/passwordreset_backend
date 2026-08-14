const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [options.email],
        subject: options.subject,
        text: options.message,
    });

    if (error) {
        console.log("Resend error:", error);
        throw new Error(error.message);
    }

    console.log("Email sent:", data);

    return data;
};

module.exports = sendEmail;