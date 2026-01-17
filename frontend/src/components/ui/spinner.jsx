import { cn } from "../../utils/cn";

export const Spinner = ({ className, size = "default", ...props }) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        default: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
        xl: "h-12 w-12 border-4",
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-primary border-t-transparent",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};
