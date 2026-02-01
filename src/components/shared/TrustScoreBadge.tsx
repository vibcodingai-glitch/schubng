"use client";

import { cn } from "@/lib/utils";

/**
 * TrustScoreBadge Component
 * 
 * Displays a circular progress ring showing the user's trust score (0-100).
 * Color-coded based on score ranges:
 * - 80-100: Emerald (High Trust)
 * - 50-79: Blue (Good Trust)
 * - 0-49: Amber (Low Trust)
 * 
 * @param score - Trust score value from 0 to 100
 * @param size - Visual size of the badge
 * @param showLabel - Whether to display "Trust Score" label below the badge
 */

interface TrustScoreBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function TrustScoreBadge({ score, size = 'md', showLabel = false }: TrustScoreBadgeProps) {
    // Clamp score between 0 and 100
    const clampedScore = Math.min(100, Math.max(0, score));

    // Determine color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return { text: 'text-emerald-600', ring: 'stroke-emerald-600', bg: 'bg-emerald-50' };
        if (score >= 50) return { text: 'text-blue-600', ring: 'stroke-blue-600', bg: 'bg-blue-50' };
        return { text: 'text-amber-600', ring: 'stroke-amber-600', bg: 'bg-amber-50' };
    };

    const getScoreLevel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Low';
    };

    const colors = getScoreColor(clampedScore);
    const level = getScoreLevel(clampedScore);

    // Size configurations
    const sizeConfig = {
        sm: {
            container: 'w-16 h-16',
            svg: 56,
            strokeWidth: 4,
            radius: 24,
            fontSize: 'text-lg',
            labelSize: 'text-xs',
        },
        md: {
            container: 'w-24 h-24',
            svg: 88,
            strokeWidth: 6,
            radius: 38,
            fontSize: 'text-2xl',
            labelSize: 'text-sm',
        },
        lg: {
            container: 'w-32 h-32',
            svg: 120,
            strokeWidth: 8,
            radius: 52,
            fontSize: 'text-3xl',
            labelSize: 'text-base',
        },
    };

    const config = sizeConfig[size];
    const circumference = 2 * Math.PI * config.radius;
    const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn("relative inline-flex items-center justify-center", config.container)}>
                {/* Background circle */}
                <svg
                    className="absolute transform -rotate-90"
                    width={config.svg}
                    height={config.svg}
                >
                    <circle
                        cx={config.svg / 2}
                        cy={config.svg / 2}
                        r={config.radius}
                        className="stroke-slate-100"
                        strokeWidth={config.strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={config.svg / 2}
                        cy={config.svg / 2}
                        r={config.radius}
                        className={cn("transition-all duration-500 ease-out", colors.ring)}
                        strokeWidth={config.strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Score display */}
                <div className="flex flex-col items-center justify-center">
                    <span className={cn("font-bold leading-none", config.fontSize, colors.text)}>
                        {clampedScore}
                    </span>
                    {size !== 'sm' && (
                        <span className="text-xs text-slate-500 mt-0.5">{level}</span>
                    )}
                </div>
            </div>

            {showLabel && (
                <span className={cn("font-medium text-slate-600", config.labelSize)}>
                    Trust Score
                </span>
            )}
        </div>
    );
}
