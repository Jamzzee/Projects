import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createGuest, getGuest } from './data-service';

//* Set the correct URL (local or prod)
const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const authConfig = {
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({
            email: user.email,
            fullName: user.name,
          });

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);

      session.user.guestId = guest.id;
      return session;
    },
  },
  // Tells NextAuth which URL to use for sing-in
  redirect: async (url, baseUrl) => {
    if (url.startsWith('/account')) {
      return `${nextAuthUrl}${url}`;
    }
    return baseUrl;
  },
  pages: {
    signIn: '/login',
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
