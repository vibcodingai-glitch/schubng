"use client";

import { Button } from "@/components/ui/button";
import { Award, Users, FileText, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "verifications" | "new_members" | "my_industry" | "my_state";

export function FeedFilters() {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const filters = [
        { id: "all" as FilterType, label: "All Activity", icon: null },
        { id: "verifications" as FilterType, label: "Verifications", icon: Award },
        { id: "new_members" as FilterType, label: "New Members", icon: Users },
        { id: "my_industry" as FilterType, label: "My Industry", icon: Briefcase },
        { id: "my_state" as FilterType, label: "My State", icon: MapPin },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                    <Button
                        key={filter.id}
                        variant={activeFilter === filter.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(filter.id)}
                        className={`whitespace-nowrap ${activeFilter === filter.id
                                ? "bg-blue-600 hover:bg-blue-700"
                                : ""
                            }`}
                    >
                        {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                        {filter.label}
                    </Button>
                );
            })}
        </div>
    );
}
