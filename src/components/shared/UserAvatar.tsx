"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

/**
 * UserAvatar Component
 * 
 * Displays a user avatar with optional verified ring indicator.
 * Falls back to initials if no image is provided.
 * 
 * @param user - User object with name and optional avatar URL
 * @param size - Avatar size variant
 * @param showVerifiedRing - Show a blue checkmark ring for verified users
 */

interface UserAvatarProps {
    user: {
        name: string;
        avatar?: string;
    };
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showVerifiedRing?: boolean;
    className?: string;
}

const SIZE_CONFIG = {
    xs: {
        container: 'w-6 h-6',
        text: 'text-[10px]',
        ring: 'ring-2',
        checkSize: 'w-2.5 h-2.5',
        checkPosition: '-right-0.5 -bottom-0.5',
    },
    sm: {
        container: 'w-8 h-8',
        text: 'text-xs',
        ring: 'ring-2',
        checkSize: 'w-3 h-3',
        checkPosition: '-right-0.5 -bottom-0.5',
    },
    md: {
        container: 'w-10 h-10',
        text: 'text-sm',
        ring: 'ring-2',
        checkSize: 'w-4 h-4',
        checkPosition: '-right-1 -bottom-1',
    },
    lg: {
        container: 'w-16 h-16',
        text: 'text-xl',
        ring: 'ring-3',
        checkSize: 'w-5 h-5',
        checkPosition: '-right-1 -bottom-1',
    },
    xl: {
        container: 'w-24 h-24',
        text: 'text-2xl',
        ring: 'ring-4',
        checkSize: 'w-6 h-6',
        checkPosition: '-right-1.5 -bottom-1.5',
    },
};

/**
 * Generates initials from a full name
 * Takes first letter of first two words
 */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function UserAvatar({
    user,
    size = 'md',
    showVerifiedRing = false,
    className
}: UserAvatarProps) {
    const config = SIZE_CONFIG[size];
    const initials = getInitials(user.name);

    return (
        <div className={cn("relative inline-block", className)}>
            <Avatar
                className={cn(
                    config.container,
                    showVerifiedRing && cn(
                        "ring-blue-500 ring-offset-2",
                        config.ring
                    )
                )}
            >
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className={cn("bg-blue-100 text-blue-700 font-semibold", config.text)}>
                    {initials}
                </AvatarFallback>
            </Avatar>

            {showVerifiedRing && (
                <div
                    className={cn(
                        "absolute rounded-full bg-blue-500 flex items-center justify-center",
                        config.checkSize,
                        config.checkPosition
                    )}
                >
                    <CheckCircle className="w-full h-full text-white fill-blue-500" />
                </div>
            )}
        </div>
    );
}
