'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Image from 'next/image';
import not_found_image from '@/public/404.webp';

const NotFoundPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/404');
    }, [router]);

    return (
        <div className="flex grow flex-col items-center justify-center gap-4 bg-light-secondary dark:bg-dark">
            <div
                onClick={() => router.back()}
                className="flex flex-col items-center"
            >
                <div className="relative size-96">
                    <Image
                        alt="404"
                        src={not_found_image}
                        width={500}
                        height={500}
                        className="h-full w-full"
                        priority
                    />
                </div>

                <h1 className="-translate-y-24 cursor-pointer text-6xl font-bold text-[#7b8498] transition-all hover:text-black dark:hover:!text-white">
                    Go back?
                </h1>
            </div>
        </div>
    );
};

export default NotFoundPage;
