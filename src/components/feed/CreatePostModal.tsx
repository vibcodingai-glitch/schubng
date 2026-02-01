"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    X,
    ChevronDown,
    Smile,
    Image as ImageIcon,
    Calendar,
    PartyPopper,
    Plus,
    Clock,
    Sparkles,
    Globe,
    Users,
    Lock,
} from "lucide-react";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        firstName: string;
        lastName: string;
        profilePhotoUrl?: string;
    };
    onPost: (content: string) => Promise<void>;
    isPosting: boolean;
}

export function CreatePostModal({
    isOpen,
    onClose,
    user,
    onPost,
    isPosting,
}: CreatePostModalProps) {
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState<"anyone" | "connections" | "private">("anyone");

    const handlePost = async () => {
        if (!content.trim()) return;
        await onPost(content);
        setContent("");
        onClose();
    };

    const getVisibilityLabel = () => {
        switch (visibility) {
            case "anyone":
                return "Post to Anyone";
            case "connections":
                return "Connections only";
            case "private":
                return "Only me";
            default:
                return "Post to Anyone";
        }
    };

    const getVisibilityIcon = () => {
        switch (visibility) {
            case "anyone":
                return <Globe className="w-3 h-3" />;
            case "connections":
                return <Users className="w-3 h-3" />;
            case "private":
                return <Lock className="w-3 h-3" />;
            default:
                return <Globe className="w-3 h-3" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-4 pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={user.profilePhotoUrl || ""} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 px-1 text-gray-600">
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => setVisibility("anyone")}>
                                                <Globe className="w-4 h-4 mr-2" /> Anyone
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setVisibility("connections")}>
                                                <Users className="w-4 h-4 mr-2" /> Connections only
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setVisibility("private")}>
                                                <Lock className="w-4 h-4 mr-2" /> Only me
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    {getVisibilityIcon()}
                                    <span>{getVisibilityLabel()}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content Area */}
                <div className="min-h-[250px] p-4">
                    <textarea
                        className="w-full min-h-[200px] text-lg text-gray-800 placeholder:text-gray-400 resize-none border-none outline-none focus:ring-0"
                        placeholder="What do you want to talk about?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Toolbar */}
                <div className="px-4 py-3 border-t">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <Smile className="w-5 h-5 text-gray-600" />
                        </Button>

                        <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-gray-700 border-gray-300 hover:bg-gray-50">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            Rewrite with AI
                        </Button>

                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <Calendar className="w-5 h-5 text-gray-600" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <PartyPopper className="w-5 h-5 text-gray-600" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <Plus className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t flex items-center justify-end gap-3">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100">
                        <Clock className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button
                        className="rounded-full px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
                        disabled={!content.trim() || isPosting}
                        onClick={handlePost}
                    >
                        {isPosting ? "Posting..." : "Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
