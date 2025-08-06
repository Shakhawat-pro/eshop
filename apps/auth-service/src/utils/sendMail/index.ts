import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Render an EJS email template
const renderEmailTemplate = async (templateName: String, data: Record<string, any>): Promise<string> => {
    const templatePath = path.join(
        "apps",
        "auth-service",
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    );
    return ejs.renderFile(templatePath, data)
}

// Send an email using nodemailer

export const sendEmail = async (to: string, subject: string, templateName: string, data: Record<string, any>) => {
    try {
        console.log("hit sendEmail", {
            to,
            subject,
            templateName,
            data
        });
        
        const html = await renderEmailTemplate(templateName, data);

        await transporter.sendMail({
            from: `<${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        })

        return true
    } catch (error) {
        console.log("Error Sending Error",error);
        return false;
    }
}