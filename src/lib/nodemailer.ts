import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER || 'forms.futuresoft@gmail.com';
const pass = process.env.GMAIL_APP_PASSWORD || '';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const ADMIN_EMAILS = [
  'brsoffice.india@gmail.com',
  'adarshrke2415@gmail.com',
  'forms.futuresoft@gmail.com',
];
