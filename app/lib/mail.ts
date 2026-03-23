import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"OPD Management System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendApprovalEmail(email: string, name: string, role: string, password?: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`;
  
  const subject = "Your OPD Management System Account is Approved";
  
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Welcome to OPD Management System, ${name}!</h2>
      <p>Your account has been approved by the administrator. You can now log in to the system.</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        ${password ? `<p><strong>Password:</strong> ${password}</p>` : `<p><em>Use the password you provided during registration.</em></p>`}
        <p><strong>Role:</strong> ${role}</p>
      </div>
      <p>
        <a href="${loginUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Log In Now
        </a>
      </p>
      <p>If you didn't request this account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} OPD Management System</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text: `Your account for OPD Management System has been approved. Log in at ${loginUrl}. Email: ${email}${password ? ` Password: ${password}` : ""}`,
    html: htmlContent,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, password?: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`;
  
  const subject = "Your OPD Management System Password has been Reset";
  
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hello, ${name}!</h2>
      <p>Your password for the OPD Management System has been reset by the administrator.</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        ${password ? `<p><strong>New Password:</strong> ${password}</p>` : ""}
      </div>
      <p>
        <a href="${loginUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Log In Now
        </a>
      </p>
      <p>Please change your password after logging in for better security.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} OPD Management System</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text: `Your password for OPD Management System has been reset. Log in at ${loginUrl}. Email: ${email}${password ? ` New Password: ${password}` : ""}`,
    html: htmlContent,
  });
}
