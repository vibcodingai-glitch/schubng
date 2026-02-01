"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FileUpload Component
 * 
 * Drag-and-drop file upload zone with click-to-browse functionality.
 * Shows preview for images and file info for other types.
 * 
 * @param accept - Accepted file types (e.g., "image/*,.pdf")
 * @param maxSize - Maximum file size in bytes
 * @param onUpload - Callback when file is selected
 * @param preview - Optional preview URL (for images)
 * @param isLoading - Loading state during upload
 * @param className - Additional CSS classes
 */

interface FileUploadProps {
    accept: string;
    maxSize: number;
    onUpload: (file: File) => void;
    preview?: string;
    isLoading?: boolean;
    className?: string;
}

export function FileUpload({
    accept,
    maxSize,
    onUpload,
    preview,
    isLoading = false,
    className
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize) {
            return `File size exceeds ${formatFileSize(maxSize)}`;
        }
        return null;
    };

    const handleFile = (file: File) => {
        setError("");
        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            return;
        }

        setSelectedFile(file);
        onUpload(file);
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const isImage = selectedFile?.type.startsWith("image/") || preview;

    return (
        <div className={cn("w-full", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
            />

            {/* Upload Zone */}
            <div
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 hover:border-slate-400 bg-slate-50",
                    isLoading && "opacity-50 cursor-not-allowed",
                    error && "border-red-300 bg-red-50"
                )}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                        <p className="text-sm text-slate-600">Uploading...</p>
                    </div>
                ) : preview || (selectedFile && isImage) ? (
                    <div className="relative">
                        <img
                            src={preview || (selectedFile ? URL.createObjectURL(selectedFile) : "")}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded"
                        />
                        {!isLoading && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ) : selectedFile ? (
                    <div className="flex items-center justify-between p-4 bg-white rounded border border-slate-200">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        {accept.includes("image") ? (
                            <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
                        ) : (
                            <Upload className="w-12 h-12 text-slate-400 mb-3" />
                        )}
                        <p className="text-sm font-medium text-slate-900 mb-1">
                            Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-slate-500">
                            Maximum file size: {formatFileSize(maxSize)}
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
