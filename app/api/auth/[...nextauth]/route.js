import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { sendApprovalEmail } from '@/lib/nodemailer';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const client = await clientPromise;
        const db = client.db();

        const user = await db
          .collection('users')
          .findOne({ email: profile.email });

        if (!user) {
          const newUser = {
            name: profile.name,
            email: profile.email,
            profileImage: profile.picture,
            status: 'pending',
          };

          await db.collection('users').insertOne(newUser);
          await sendApprovalEmail(newUser);

          return {
            id: newUser._id,
            ...newUser,
          };
        }

        if (['pending', 'rejected'].includes(user.status)) {
          throw new Error(`Your registration has been ${user.status}.`);
        }

        return {
          id: user._id,
          ...user,
        };
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();

        const user = await db
          .collection('users')
          .findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (['pending', 'rejected'].includes(user.status)) {
          throw new Error(`Your registration has been ${user.status}.`);
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage, // Ensure profileImage is included
          status: user.status,
        };
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          id: user.id,
          name: user.name,
          image: user.profileImage, // Ensure image is set from profileImage
          status: user.status,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          image: token.image,
          status: token.status,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
