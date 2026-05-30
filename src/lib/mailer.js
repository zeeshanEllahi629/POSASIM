import nodemailer from "nodemailer";
import prisma from "./prisma";

export async function sendApprovalEmail(userEmail, userName) {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings || !settings.mail_host) return false;

    const transporter = nodemailer.createTransport({
      host: settings.mail_host,
      port: settings.mail_port,
      secure: settings.mail_port === 465,
      auth: {
        user: settings.mail_username,
        pass: settings.mail_password,
      },
    });

    await transporter.sendMail({
      from: `"${settings.app_name || 'Foodefy'}" <${settings.mail_from_address}>`,
      to: userEmail,
      subject: 'Your Account Has Been Approved',
      text: `Hello ${userName},\n\nYour account has been approved by the Super User. You can now log in to the admin panel.\n\nThank you,\n${settings.app_name || 'Foodefy'} Team`
    });
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
}
