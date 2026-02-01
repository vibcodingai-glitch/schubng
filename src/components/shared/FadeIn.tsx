"use client";

import { motion } from "framer-motion";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    duration?: number;
}

export function FadeIn({ children, delay = 0, className, duration = 0.4 }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStagger({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInItem({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
