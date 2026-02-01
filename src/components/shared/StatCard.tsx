"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatCard Component
 * 
 * Dashboard statistics card with optional trend indicator and icon.
 * Displays key metrics with visual hierarchy and positive/negative trends.
 * 
 * @param label - Stat label/description
 * @param value - Main stat value (number or formatted string)
 * @param change - Optional trend change data
 * @param icon - Optional icon component
 * @param className - Additional CSS classes
 */

interface StatCardProps {
    label: string;
    value: string | number;
    change?: {
        value: string;
        type: 'positive' | 'negative' | 'neutral';
    };
    icon?: LucideIcon;
    className?: string;
}

export function StatCard({
    label,
    value,
    change,
    icon: Icon,
    className
}: StatCardProps) {
    const getTrendIcon = (type: 'positive' | 'negative' | 'neutral') => {
        switch (type) {
            case 'positive':
                return TrendingUp;
            case 'negative':
                return TrendingDown;
            case 'neutral':
                return Minus;
        }
    };

    const getTrendColor = (type: 'positive' | 'negative' | 'neutral') => {
        switch (type) {
            case 'positive':
                return 'text-emerald-600';
            case 'negative':
                return 'text-red-600';
            case 'neutral':
                return 'text-slate-500';
        }
    };

    const TrendIcon = change ? getTrendIcon(change.type) : null;
    const trendColor = change ? getTrendColor(change.type) : '';

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-slate-600">
                    {label}
                </p>
                {Icon && (
                    <Icon className="h-4 w-4 text-slate-400" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                    {value}
                </div>
                {change && TrendIcon && (
                    <p className={cn("text-xs flex items-center mt-1", trendColor)}>
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {change.value}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
