import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    steps: { label: string }[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
    return (
        <div className="space-y-4">
            {/* Step Counter */}
            <div className="text-center text-sm text-slate-600 font-medium">
                Step {currentStep} of {totalSteps}
            </div>

            {/* Visual Progress Dots */}
            <div className="flex items-center justify-center gap-2">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={index} className="flex items-center">
                            <div
                                className={cn(
                                    "flex items-center justify-center transition-all",
                                    isActive || isCompleted ? "scale-100" : "scale-90"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                                        isCompleted && "bg-blue-600 text-white",
                                        isActive && "bg-blue-600 text-white ring-4 ring-blue-100",
                                        !isActive && !isCompleted && "bg-slate-200 text-slate-500"
                                    )}
                                >
                                    {isCompleted ? "✓" : stepNumber}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "w-12 h-0.5 mx-2 transition-colors",
                                        isCompleted ? "bg-blue-600" : "bg-slate-200"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Labels */}
            <div className="flex justify-center gap-2">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "text-xs font-medium transition-colors",
                                isActive ? "text-blue-600" : "text-slate-400"
                            )}
                        >
                            {step.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
