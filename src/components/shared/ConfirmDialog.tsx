"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * ConfirmDialog Component
 * 
 * Reusable confirmation dialog with variant styling for different action types.
 * Provides accessible confirmation for destructive or important actions.
 * 
 * Variants:
 * - danger: Red styling for destructive actions (delete, remove)
 * - warning: Amber styling for warning actions (revoke, suspend)
 * - default: Blue styling for standard confirmations
 * 
 * @param open - Dialog open state
 * @param onOpenChange - Callback when open state changes
 * @param title - Dialog title
 * @param description - Dialog description/message
 * @param confirmLabel - Confirm button text
 * @param cancelLabel - Cancel button text
 * @param variant - Visual variant for action type
 * @param onConfirm - Callback when confirmed
 * @param onCancel - Callback when cancelled
 * @param isLoading - Loading state during confirmation
 */

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = 'default',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    const handleCancel = () => {
        if (!isLoading) {
            onCancel?.();
            onOpenChange(false);
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    button: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                    title: "text-red-900",
                };
            case 'warning':
                return {
                    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-600",
                    title: "text-amber-900",
                };
            case 'default':
                return {
                    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600",
                    title: "text-slate-900",
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={styles.title}>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn(styles.button)}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
