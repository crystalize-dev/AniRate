import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { login, password } = await req.json();

        if (!password || !login) {
            return NextResponse.json(
                { error: 'Не введен пароль или логин!' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(
            password,
            await bcrypt.genSalt(10)
        );
        const createdUser = await prisma.user.create({
            data: { login, password: hashedPassword, role: 'USER' }
        });

        return NextResponse.json(
            {
                id: createdUser.id,
                login: createdUser.login,
                role: createdUser.role
            },
            { status: 200 }
        );
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Логин уже используется!' },
                    { status: 400 }
                );
            }
        }
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
