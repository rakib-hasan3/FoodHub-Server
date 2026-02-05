import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,

    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const sendVerificationUrl = `${process.env.APP_URL}/verify-email?token${token}`
                const info = await transporter.sendMail({
                    from: '"Foodhub" <foodhub@ph.com>',
                    to: user.email,
                    subject: "Please Verify Your email",
                    text: "Hello world?", // Plain-text version of the message
                    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#16a34a;padding:20px;">
                <h1 style="color:#ffffff;margin:0;">🍽️ FoodHub</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="margin-top:0;color:#333;">Verify Your Email Address</h2>
                <p style="color:#555;font-size:15px;line-height:1.6;">
                  Thanks for signing up with <strong>FoodHub</strong>!  
                  Please confirm your email address to activate your account.
                </p>

                <p style="text-align:center;margin:30px 0;">
                  <a href="${sendVerificationUrl}" 
                     style="background:#16a34a;color:#ffffff;text-decoration:none;
                            padding:12px 25px;border-radius:5px;font-size:16px;display:inline-block;">
                    Verify Email
                  </a>
                </p>

                <p style="color:#777;font-size:14px;line-height:1.6;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;color:#16a34a;font-size:13px;">
                  ${sendVerificationUrl}
                </p>

                <p style="color:#999;font-size:12px;margin-top:30px;">
                  If you did not create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f9fafb;padding:15px;font-size:12px;color:#888;">
                © ${new Date().getFullYear()} FoodHub. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `, // HTML version of the message
                });

                console.log("Message sent:", info.messageId);
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    },
});