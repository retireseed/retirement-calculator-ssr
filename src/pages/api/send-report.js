import { openDb } from '../../lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'retireseed@gmail.com',
    pass: 'ebhv fbcd hwss yuqr' // Use App Password from Google Account
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, csvContent, ipAddress } = req.body;

      // Store download information
      const db = await openDb();
      await db.run(
        'INSERT INTO downloads (ip_address, name, email) VALUES (?, ?, ?)',
        [ipAddress, name, email]
      );

      // Send email
      await transporter.sendMail({
        from: 'retireseed@gmail.com',
        to: email,
        subject: 'Your Retirement Projections Report',
        text: `Dear ${name},\n\nPlease find attached your retirement projections report.\n\nBest regards,\nRetireSeed Team`,
        attachments: [
          {
            filename: 'retirement_projections.csv',
            content: csvContent
          }
        ]
      });

      res.status(200).json({ message: 'Report sent successfully' });
    } catch (error) {
      console.error('Error sending report:', error);
      res.status(500).json({ error: 'Error sending report' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
