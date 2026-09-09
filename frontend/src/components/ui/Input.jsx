import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/60 transition-all duration-150 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const SearchInput = React.forwardRef(({ className, leftIcon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {leftIcon && (
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--ink-muted)]">
          {leftIcon}
        </div>
      )}
      <input
        type="search"
        className={cn(
          "flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/60 transition-all duration-150 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50",
          leftIcon ? "pl-10 pr-4" : "px-4",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
export default Input;
