"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export function NetworkSearch() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search professionals by name, role, or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                />
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    All
                </Button>
                <Button variant="outline" size="sm">
                    Verified Only
                </Button>
                <Button variant="outline" size="sm">
                    My Industry
                </Button>
                <Button variant="outline" size="sm">
                    My State
                </Button>
            </div>
        </div>
    );
}
