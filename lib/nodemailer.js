import nodemailer from 'nodemailer';

export const sendApprovalEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const approvalLink = `${
    process.env.APP_URL
  }/api/approve?email=${encodeURIComponent(user.email)}&action=approve`;
  const rejectionLink = `${
    process.env.APP_URL
  }/api/approve?email=${encodeURIComponent(user.email)}&action=reject`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New User Registration Approval',
    html: `
      <p>A new user has registered and is pending approval.</p>
      <p>Name: ${user.name}</p>
      <p>Email: ${user.email}</p>
      <p>
        <a href="${approvalLink}">Approve</a> |
        <a href="${rejectionLink}">Reject</a>
      </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent successfully');
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};
