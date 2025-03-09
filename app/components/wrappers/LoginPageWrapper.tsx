import { motion } from 'framer-motion';
import React from 'react';

const LoginPageWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            layoutId="mainWin"
            className="flex h-full w-full items-center border-solid border-primary bg-light backdrop-blur-md lg:h-fit lg:w-fit lg:min-w-96 lg:rounded-xl lg:border dark:border-primary-dark dark:bg-dark"
        >
            {children}
        </motion.div>
    );
};

export default LoginPageWrapper;
