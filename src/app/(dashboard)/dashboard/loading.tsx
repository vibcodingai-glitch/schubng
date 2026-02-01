import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6 max-w-xl mx-auto py-8 px-4 sm:px-0">
            {/* Create Post Skeleton */}
            <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 p-4 rounded-xl flex gap-4 shadow-sm">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-12 w-full rounded-full" />
                </div>
            </div>

            {/* Feed Skeletons */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200/50 p-4 rounded-xl space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-24 w-full rounded-lg mt-2" />
                    </div>
                    <div className="flex justify-between pt-2">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}
