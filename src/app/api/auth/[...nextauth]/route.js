import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Kullanıcı bulunamadı veya şifre yanlış");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Şifre yanlış");
        }

        if (user.isBanned) {
          throw new Error("Hesabınız LudenOS kuralları gereği yasaklanmıştır.");
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "ludenos-super-secret-key-2026",
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth ile giriş yapan kullanıcıya username atama
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });
          if (existingUser && !existingUser.username) {
            const baseUsername = '@' + (user.email?.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
            await prisma.user.update({
              where: { email: user.email },
              data: { username: baseUsername }
            });
          }
        } catch (_) {}
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.isBanned = user.isBanned || false;
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      // Vercel üzerinde "494: REQUEST_HEADER_TOO_LARGE" hatasını önlemek için
      // base64 formatındaki büyük resim verilerini ve uzun metinleri JWT cookie'sinden siliyoruz!
      delete token.picture;
      delete token.image;
      delete token.bannerImage;
      delete token.bio;

      if (token.id && (!token.role || token.isBanned === undefined)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true, isBanned: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.isBanned = dbUser.isBanned;
          }
        } catch (_) {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && (token.id || token.sub)) {
        const userId = token.id || token.sub;
        session.user.id = userId;
        session.user.role = token.role || "USER";
        session.user.isBanned = token.isBanned || false;

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, image: true, username: true, role: true, isBanned: true }
          });
          if (dbUser) {
            session.user.name = dbUser.name || session.user.name;
            session.user.email = dbUser.email || session.user.email;
            session.user.image = dbUser.image || null;
            session.user.username = dbUser.username || null;
            session.user.role = dbUser.role || "USER";
            session.user.isBanned = dbUser.isBanned || false;
          }
        } catch (_) {}
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
