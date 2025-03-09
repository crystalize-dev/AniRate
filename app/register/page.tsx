'use client';
import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import logo_image from '@/public/logo.png';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { customAxios } from '@/axios/customAxios';
import LoginPageWrapper from '../components/Wrappers/LoginPageWrapper';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [fetching, setFetching] = useState(false);
    const router = useRouter();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;
        const passwordRepeat = formData.get('passwordRepeat') as string;

        if (!login || !password || !passwordRepeat) {
            toast.error('Заполните все обязательные поля!');
            return;
        }

        if (password !== passwordRepeat) {
            toast.error('Пароли не совпадают!');
            return;
        }

        setFetching(true);

        try {
            await customAxios('POST', 'register', setFetching, {
                data: { login, password },
                actionOnSuccess: () => {
                    router.push('/login');
                },
                loadingString: 'Регистрация...',
                successString: 'Успешно! Теперь вы можете войти!'
            });
        } catch (error) {
            toast.error('Произошла ошибка!');
        }
    };

    return (
        <LoginPageWrapper>
            <form
                className="flex h-full w-full flex-col items-center justify-center gap-4 p-12"
                onSubmit={submit}
            >
                <div className="relative size-28">
                    <Image
                        alt="Логотип"
                        src={logo_image}
                        priority
                        width={500}
                        height={500}
                        className="h-full w-full"
                    />
                </div>

                <motion.h1
                    layoutId="login_header"
                    className="mb-4 text-4xl font-bold text-primary"
                >
                    Регистрация
                </motion.h1>

                <Input
                    layoutId="loginInput"
                    type="text"
                    name="login"
                    disabled={fetching}
                    placeholder="Логин"
                    placeholderType="classic"
                    required
                />

                <Input
                    layoutId="passwordInput"
                    type="password"
                    name="password"
                    disabled={fetching}
                    placeholderType="classic"
                    placeholder="Пароль"
                    passwordSetup
                    required
                />

                <Input
                    type="password"
                    name="passwordRepeat"
                    disabled={fetching}
                    placeholderType="classic"
                    placeholder="Повторите пароль"
                    required
                />

                <Button
                    type="submit"
                    variant="colored"
                    className="mt-4 w-full"
                    disabled={fetching}
                >
                    Зарегистрироваться
                </Button>

                <Link
                    href={'/login'}
                    className="flex gap-2 text-sm text-zinc-600 dark:text-white/70"
                >
                    Уже есть аккаунт?
                    <span className="hover:text-primary hover:underline focus:underline">
                        Войти
                    </span>
                </Link>
            </form>
        </LoginPageWrapper>
    );
};

export default RegisterPage;
