'use client';
import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import logo_image from '@/public/logo.png';
import LoginPageWrapper from '../components/Wrappers/LoginPageWrapper';
import { motion } from 'framer-motion';

const Login = () => {
    const [fetching, setFetching] = useState(false);
    const router = useRouter();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;

        if (!login || !password) {
            toast.error('Заполните все обязательные поля!');
            return;
        }

        setFetching(true);
        const toastId = toast.loading('Вход...');

        try {
            const result = await signIn('credentials', {
                login,
                password,
                redirect: false
            });

            if (result && result.error) {
                toast.error(result.error);
            } else {
                toast.success('Успешный вход!');
                router.push('/');
            }

            setFetching(false);
        } catch (error) {
            toast.error('Произошла ошибка!');
        } finally {
            toast.dismiss(toastId);
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
                        alt="logo"
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
                    Вход
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

                <Button
                    type="submit"
                    variant="colored"
                    className="mt-4 w-full"
                    disabled={fetching}
                >
                    Войти
                </Button>

                <Link
                    href={'/register'}
                    className="flex gap-2 text-sm text-zinc-600 dark:text-white/70"
                >
                    Нет аккаунта?
                    <span className="hover:text-primary hover:underline focus:underline">
                        Зарегистрироваться
                    </span>
                </Link>
            </form>
        </LoginPageWrapper>
    );
};

export default Login;
