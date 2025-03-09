import {
    NextAuthOptions,
    User as NextAuthUser,
    Session as NextAuthSession
} from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

interface CustomUser extends NextAuthUser {
    id: string;
    role: 'USER' | 'ADMIN';
}

interface CustomSession extends NextAuthSession {
    user: CustomUser;
}

export const authConfig: NextAuthOptions = {
    secret: process.env.SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const login = credentials?.login;
                const password = credentials?.password;

                if (!login || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { login }
                });

                if (!user) throw new Error('Неверно введен логин или пароль!');

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch)
                    throw new Error('Неверно введен логин или пароль!');

                return { id: user.id, name: user.login, role: user.role };
            }
        })
    ],
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user = session.user || {};
                (session.user as CustomUser).id = token.id as string;
                session.user.name = token.name;
                (session.user as CustomUser).role = token.role as
                    | 'USER'
                    | 'ADMIN';
            }

            return session as CustomSession;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = (user as CustomUser).role;
            }

            return token;
        }
    }
};
