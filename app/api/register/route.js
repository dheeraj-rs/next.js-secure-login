import { hash } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { sendApprovalEmail } from '@/lib/nodemailer';

export async function POST(req) {
  try {
    const { name, email, password, profileImage } = await req.json();

    // Validate input
    if (!email || !email.includes('@') || !password) {
      return new Response(JSON.stringify({ message: 'Invalid input' }), {
        status: 422,
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check for existing user
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 422,
      });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      profileImage,
      status: 'pending',
    };

    // Insert the new user into the database
    await db.collection('users').insertOne(newUser);
    await sendApprovalEmail(newUser);

    return new Response(
      JSON.stringify({ message: 'Registration request sent for approval' }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
