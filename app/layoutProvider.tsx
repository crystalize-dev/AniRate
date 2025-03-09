'use client';
import React, { useEffect, useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { SessionProvider, useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import ThemeToggler from './components/UI/ThemeToggler';
import Header from './components/Header';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <SessionProvider>
                <Toaster />
                <MainBody>{children}</MainBody>
            </SessionProvider>
        </ThemeProvider>
    );
};

const MainBody = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <main className="flex h-screen w-screen flex-col items-center justify-center bg-light dark:bg-dark">
            {!isAuthenticated && (
                <ThemeToggler className="absolute right-4 top-5" />
            )}

            {isAuthenticated && <Header />}

            <div className="scrollable flex w-full grow flex-col">
                {children}
            </div>
        </main>
    );
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

    useEffect(() => {
        // Проверка локального хранилища на наличие сохраненной темы
        const savedTheme = localStorage.getItem('theme') as
            | 'dark'
            | 'light'
            | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme);
        } else {
            // Проверка настроек системы пользователя
            const userPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            const initialTheme = userPrefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            document.documentElement.classList.add(initialTheme);
        }
    }, []);

    const toggleTheme = () => {
        if (theme) {
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            document.documentElement.classList.remove(theme);
            document.documentElement.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
