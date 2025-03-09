'use client';
import React from 'react';
import logo from '@/app/icon.ico';
import Image from 'next/image';
import Button from './UI/Button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggler from './UI/ThemeToggler';
import { IconType } from './Icon/icon-database';
import Icon from './Icon/Icon';

const Header = () => {
    const { data } = useSession();

    type LinkType = {
        label: string;
        href: string;
        icon: IconType;
    };

    const links: LinkType[] = [
        {
            label: 'Главная',
            href: '/',
            icon: 'home'
        },
        {
            label: 'Источники',
            href: '/sources',
            icon: 'database'
        },
        {
            label: 'Теги',
            href: '/tags',
            icon: 'hashtag'
        },
        {
            label: 'Статистика',
            href: '/statistics',
            icon: 'chart-bars'
        }
    ];

    return (
        <div className="flex h-20 min-h-20 w-full select-none items-center justify-between gap-4 bg-light px-[3%] py-4 dark:bg-dark-secondary dark:text-white">
            <Link href="/" className="flex h-full w-fit items-center gap-4">
                <div className="relative h-full overflow-hidden rounded-full">
                    <Image
                        src={logo}
                        alt="logo"
                        width={300}
                        height={300}
                        className="h-full w-full"
                        priority
                    />
                </div>
                <h1 className="text-4xl font-bold">
                    Ani<span className="text-primary">Rate</span>
                </h1>
            </Link>

            <div className="hidden h-full w-fit items-center gap-4 lg:flex">
                {links.map((link: LinkType) => (
                    <Link
                        className="group flex h-full w-fit flex-col rounded-md px-4 text-lg"
                        href={link.href}
                        key={link.label}
                    >
                        <div className="mt-2 flex items-center gap-2">
                            <Icon
                                className="text-zinc-500 transition-all group-hover:text-black dark:group-hover:text-white"
                                icon={link.icon}
                            />
                            <p className="text-zinc-500 transition-all group-hover:text-black dark:group-hover:text-white">
                                {link.label}
                            </p>
                        </div>
                        <div className="w-0 border-b-2 border-solid border-black transition-all group-hover:w-full dark:border-white" />
                    </Link>
                ))}
            </div>

            <div className="flex h-full w-fit items-center gap-4">
                <ThemeToggler />

                <p className="text-lg font-bold capitalize">
                    {data?.user?.name}
                </p>

                <Button
                    type="button"
                    variant="colored"
                    onClick={() => signOut()}
                    buttonClassName="bg-red-500 hover:text-red-500 hover:bg-transparent hover:border-red-500"
                >
                    Выйти
                </Button>
            </div>
        </div>
    );
};

export default Header;
