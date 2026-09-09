import * as React from "react";
import { cn } from "@/lib/utils";

const PADDING_STYLES = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
  xl: "p-8",
  default: "p-6",
};

const VARIANT_STYLES = {
  default: "border-border bg-surface text-ink shadow-card",
  accent: "border-transparent bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-lg shadow-teal-500/10",
  subtle: "border-border bg-surface-2 text-ink shadow-none",
};

const Card = React.forwardRef(
  ({ className, padding = "default", variant = "default", ...props }, ref) => {
    const pCls =
      PADDING_STYLES[padding] ||
      (padding === false ? "p-0" : PADDING_STYLES.default);
    const vCls = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card border transition-all duration-200",
          vCls,
          pCls,
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 mb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold leading-tight tracking-tight text-ink",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-ink-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-auto", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export default Card;
